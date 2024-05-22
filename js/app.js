var app = angular.module('myApp', ["ngRoute"]);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!'); // Thêm dòng này để đảm bảo sử dụng hashbang mode
    $routeProvider
        .when('/', {
            templateUrl: 'Templates/post.html',
            controller: 'postCtrl'
        })
        .when('/createPost', {
            templateUrl: 'Templates/create.html',
            controller: 'createCtrl'
        })
        .when('/post/:id', {
            templateUrl: 'Templates/view.html',
            controller: 'viewCtrl'
        })
        .when('/delete/:id', {
            templateUrl: 'Templates/delete.html',
            controller: 'deleteCtrl'
        })
        .when('/updatePost/:id', {
            templateUrl: 'Templates/update.html',
            controller: 'updateCtrl'
        })
        .when('/login', {
            templateUrl: 'Templates/login.html',
        })
        .otherwise({
            redirectTo: '/'
        })
});


app.directive('loadCss', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = attrs.loadCss;
            head.appendChild(link);

            // Clean up on destroy
            scope.$on('$destroy', function () {
                head.removeChild(link);
            });
        }
    };
});


app.controller("updateCtrl", function ($scope, $http, $routeParams) {
    // Fetch the post to be updated
    $http({
        url: "webservices/getPost.php",
        params: { id: $routeParams.id },
        method: "get"
    }).then(function (response) {
        if (response.data.status !== 0) {
            $scope.post = response.data;
        } else {
            alert('Post not found');
        }
    });

    // Update the post
    $scope.updatePost = function () {

        var data = {
            id: $scope.post.id,
            title: $scope.post.title,
            description: $scope.post.description
        };
        $http({
            url: "webservices/update.php",
            method: "POST",
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            if (response.data.status === 1) {
                alert('Post updated successfully');
            } else {
                alert('Failed to update post: ' + response.data.msg);
            }
        });
    };
}).directive('ckEditor', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return;

            var editor = CKEDITOR.replace(element[0]);

            editor.on('instanceReady', function () {
                editor.setData(ngModel.$viewValue || '');
            });

            editor.on('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(editor.getData());
                });
            });

            ngModel.$render = function () {
                editor.setData(ngModel.$viewValue || '');
            };
        }
    };
});

app.controller("deleteCtrl", function ($scope, $http, $routeParams) {
    $http({
        url: "webservices/delete.php",
        params: { id: $routeParams.id },
        method: "get"
    })
        .then(function (response) {
            $scope.posts = response.data;

        })
});

app.controller("postCtrl", function ($scope, $http) {
    $scope.searchQuery = '';
    $scope.currentPage = 1;
    $scope.posts = [];
    $scope.totalPages = 0;
    $scope.noDataMessage = '';

    $scope.loadPosts = function () {
        $http.get("webservices/allpost.php", {
            params: {
                q: $scope.searchQuery,
                page: $scope.currentPage
            }
        }).then(function (response) {
            if (response.data.info.length === 0) {
                $scope.noDataMessage = "No data available";
            } else {
                $scope.noDataMessage = '';
            }
            $scope.posts = response.data;
            $scope.totalPages = Math.ceil(response.data.total / response.data.limit);
        });
    };

    $scope.goToPage = function (page) {
        if (page > 0 && page <= $scope.totalPages) {
            $scope.currentPage = page;
            $scope.loadPosts();
        }
    };

    // Watch for changes in searchQuery and currentPage to reload posts
    $scope.$watch('searchQuery', function () {
        $scope.currentPage = 1; // Reset to the first page on new search
        $scope.loadPosts();
    });

    $scope.$watch('currentPage', function () {
        $scope.loadPosts();
    });


    $scope.loadPosts(); // Initial load
    $scope.searchRemove = () => {
        document.querySelector('.search input').value = "";
        $scope.searchQuery = "";
        $scope.loadPosts();
    }
});
app.controller("viewCtrl", function ($scope, $http, $routeParams) {
    var postId = document.querySelector('.post-content-id');

    $http({
        url: "webservices/getPost.php",
        params: { id: $routeParams.id },
        method: "get"
    })
        .then(function (response) {
            $scope.posts = response;
            postId.innerHTML = $scope.posts.data.description
            //    or postId.innerHTML =  `${response.data.description}`
            console.log($scope.posts);
        })
});

app.controller("createCtrl", function ($scope, $http) {
    var btnCreate = document.querySelector('.btn-create-post');
    btnCreate.disabled = true;
    btnCreate.classList.add('disabled');
    $scope.description = "";
    $scope.title = "";
    $scope.msg = "";
    $scope.statusTitle = false;
    $scope.statusDes = false;
    $scope.titleChange = () => {
        if ($scope.title.toString().length > 0) {
            $scope.statusTitle = true
            btnCreate.disabled = false;
            btnCreate.classList.remove('disabled');
        } else {
            $scope.statusTitle = false
            btnCreate.disabled = true;
            btnCreate.classList.add('disabled');
        }
    }

    $scope.add = function () {
        var myModalEl = document.getElementById('createModal');
        var modal = new bootstrap.Modal(myModalEl);


        var data = {
            title: $scope.title.toString(),
            description: $scope.description.toString()
        };
        $http.post("webservices/addPost.php", data)
            .then(function (response) {
                $scope.msg = response.data;
                location.reload()
                modal.hide();
            }, function (error) {
                console.error(error);
            }).catch(function (error) {
                console.error(error);
            });
    };
});
