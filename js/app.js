

var app = angular.module('myApp', ["ngRoute", "ngAnimate"]);

function createMessage(msgText) {
    var body = document.querySelector('body')
    let message = document.createElement('div')
    message.classList.add('message')
    message.style.display = 'block'
    message.textContent = msgText
    body.appendChild(message)
}

app.controller('mainCtrl', function ($scope, $rootScope) {
    $scope.bgColor = "white";
    $rootScope.user = JSON.parse(localStorage.getItem('user'))?.username || 'Guest';

    $scope.changeBG = () => {
        document.querySelector('body').style.background = $scope.bgColor;
        document.querySelector('.select-bg').style.background = $scope.bgColor;
    };

    $scope.logout = () => {
        localStorage.removeItem('user');
        $rootScope.user = 'Guest';
        $scope.isLogin = false;
        location.reload()
    };

    const user = JSON.parse(localStorage.getItem('user'));
    $scope.isLogin = false;
    if (JSON.parse(localStorage.getItem('user'))) {
        $scope.isLogin = true;
    }
});

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');
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
            controller: 'authCtrl'
        })
        .otherwise({
            redirectTo: '/'
        })
});

app.controller("authCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.signupData = {};
    $scope.loginData = {};

    $scope.signUp = function () {
        $http({
            method: 'POST',
            url: 'webservices/signup.php',
            data: $.param($scope.signupData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            if (response.data.status == true) {
                createMessage(response.data.message)
                const signInButton = document.getElementById('signIn');
                const container = document.getElementById('container');
                container.classList.remove("right-panel-active");
            } else {
                createMessage(response.data.message)
            }
        }, function (error) {
            console.error('Error during registration:', error);
        });
    };

    $scope.signIn = function () {
        $http({
            method: 'POST',
            url: 'webservices/login.php',
            data: $.param($scope.loginData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            createMessage("Đăng nhập thành công!")
            if (response.data.success) {
                $scope.isLogin = true;
                localStorage.setItem('user', JSON.stringify(response.data));
                $rootScope.user = response.data.username;
            } else {
                $scope.isLogin = false;
            }
        }, function (error) {
            console.error('Error during login:', error);
        });
    };
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
            scope.$on('$destroy', function () {
                head.removeChild(link);
            });
        }
    };
});


app.controller("updateCtrl", function ($scope, $http, $routeParams) {
    if (JSON.parse(localStorage.getItem('user'))) {
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
    }
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
    if (JSON.parse(localStorage.getItem('user'))) {
        $http({
            url: "webservices/delete.php",
            params: { id: $routeParams.id },
            method: "get"
        })
            .then(function (response) {
                $scope.posts = response.data;
                $scope.msg = "Post Delete Successfully"
            })
    } else {
        $scope.msg = "Failed to delete!"
    }
});

app.controller("postCtrl", function ($scope, $http, $routeParams) {
    $scope.searchQuery = '';
    $scope.currentPage = 1;
    $scope.posts = [];
    $scope.totalPages = 0;
    $scope.noDataMessage = '';
    $scope.isLogin = false;
    if (JSON.parse(localStorage.getItem('user'))) {
        $scope.isLogin = true;
    }
    $scope.isLoading = false;
    $scope.loadPosts = function () {
        $scope.isLoading = true;
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
        }).catch(function (error) {
            console.error('An error occurred:', error);
            $scope.noDataMessage = 'An error occurred while fetching data';
        }).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.goToPage = function (page) {
        if (page > 0 && page <= $scope.totalPages) {
            $scope.currentPage = page;
            $scope.loadPosts();
        }
    };


    $scope.$watch('searchQuery', function () {
        $scope.currentPage = 1;
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
    var des = document.querySelector('.description')
    const userId = (JSON.parse(localStorage.getItem('user'))) ? JSON.parse(localStorage.getItem('user')).id : 0
    const btnLike = document.querySelector('.like')
    var listLiked = [];
    $scope.isLoading = false;
    $scope.isLoading = true;
    $http({
        url: "webservices/listLiked.php",
        params: {
            userId: userId,
        },
        method: "get"
    })
        .then(function (response) {
            console.log(response.data)
            localStorage.setItem('listLiked', JSON.stringify(response.data))
            listLiked = JSON.parse(localStorage.getItem('listLiked'))
            listLiked.forEach(e => {
                if (e == $routeParams.id) {
                    btnLike.firstChild.className = ''
                    btnLike.firstChild.classList.add('fa-solid', 'fa-heart')
                }
            })

            return $http({
                url: "webservices/getPost.php",
                params: {
                    id: $routeParams.id,
                    userId: userId,
                },
                method: "get"
            }).then(function (response) {
                $scope.posts = response.data;
                des.innerHTML = `${response.data.description}`
                console.log($scope.posts);
            }).finally(function () {
                $scope.isLoading = false;
            })
        })

    $scope.likePost = function (postID) {
        let user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            btnLike.lastChild.textContent = '...'

            $http({
                url: "webservices/likePost.php",
                data: {
                    postId: postID,
                    userId: user.id
                },
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    console.log(response.data.msg)
                    btnLike.firstChild.className = '';
                    btnLike.firstChild.classList.add(response.data.icon, 'fa-heart')
                    btnLike.lastChild.innerHTML = response.data.likes

                })


        } else {
            createMessage("Đăng nhập đi bạn!")
        }
    }
});
app.controller("createCtrl", function ($scope, $http) {
    if (JSON.parse(localStorage.getItem('user'))) {
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
    }
});
