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


// app.controller("postCtrl", function($scope, $http){
//     $http.get("webservices/allpost.php")
//     .then(function(response){
//         $scope.posts = response.data;
//         console.log($scope.posts);
//     });
// });


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
});



app.controller("viewCtrl", function ($scope, $http, $routeParams) {
    $http({
        url: "webservices/getPost.php",
        params: { id: $routeParams.id },
        method: "get"
    })
        .then(function (response) {
            $scope.posts = response.data;
            console.log($scope.posts);
        })
});

// app.controller("createCtrl", function($scope){
//     $('#submit').click(function(){
//         var title = $("#title").val();
//         var des = $("#description").val();
//         var dataString = $("#myForm").serialize();
//         if(title == "" || des == ""){
//             $("#msg").html("Please fill all details");
//         }
//         else{
//             $.ajax({
//                 type:'POST',
//                 url: "webservices/addPost.php",
//                 data: dataString,
//                 cache: false,
//                 success: function(result){
//                     $('#msg').html(result);
//                     var title = $("#title").val();
//                     var descr = $('#description').val();
//                 }
//             });
//         }
//         return false;
//     })
// });

app.directive('ckEditor', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return;
            ClassicEditor
                .create(element[0])
                .then(editor => {
                    editor.model.document.on('change', () => {
                        scope.$apply(() => {
                            let str = editor.getData();
                            str = str.replace(/<[^>]*>?/gm, '');
                            ngModel.$setViewValue(str);
                        });
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };
});

app.controller("createCtrl", function ($scope, $http) {
    $scope.description = "";
    $scope.title = "";

    $scope.add = function () {
        console.log($scope.title.toString(), $scope.description)

        var data = {
            title: $scope.title.toString(),
            description: $scope.description.toString()
        };
        $http.post("webservices/addPost.php", data)
            .then(function (response) {
                $scope.msg = response.data;
                $scope.title = "";
                $scope.description = "";
            }, function (error) {
                console.error(error);
            });
    };
});
