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
        url: "./webservices/getPost.php",
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
            url: "./webservices/update.php",
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
        url: "./webservices/delete.php",
        params: { id: $routeParams.id },
        method: "get"
    })
        .then(function (response) {
            $scope.posts = response.data;

        })
});


app.controller("postCtrl", function ($scope, $http) {
    $http.get("./webservices/allpost.php")
        .then(function (response) {
            $scope.posts = response.data;
            console.log($scope.posts);
        });
});

app.controller("viewCtrl", function ($scope, $http, $routeParams) {
    $http({
        url: "../webservices/getPost.php",
        params: { id: $routeParams.id },
        method: "get"
    })
        .then(function (response) {
            $scope.posts = response.data;
            console.log($scope.posts);
        })
});

app.controller("createCtrl", function ($scope) {
    $('#submit').click(function () {
        var title = $("#title").val();
        var des = $("#description").val();
        var dataString = $("#myForm").serialize();
        if (title == "" || des == "") {
            $("#msg").html("Please fill all details");
        }
        else {
            $.ajax({
                type: 'POST',
                url: "./webservices/addPost.php",
                data: dataString,
                cache: false,
                success: function (result) {
                    $('#msg').html(result);
                    var title = $("#title").val();
                    var descr = $('#description').val();
                }
            });
        }
        return false;
    })
});
