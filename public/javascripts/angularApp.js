/**
 * Created by anh on 9/10/15.
 */
var app = angular.module('flapperNews', ['ngRoute']);
//var postServices = angular.module('postServices',['ngResource']);
//postServices.factory('Post', ['$resource',
//    function($resource){
//        return $resource('phones/:phoneId.json', {}, {
//            query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
//        });
//    }]);


app.factory('posts',['$http',function($http){
    return {
        posts:[],
        getAll :function() {
            return $http.get('/posts');
        },
        create :function(postData) {
            return $http.post('/posts', postData);
        },
        upvotes : function(post) {
            return $http.put('/posts/' + post._id + '/upvote');
                //.success(function(data){
                //    post.upvotes += 1;
                //});
        },
        get: function(id) {
            return $http.get('/posts/' + id);
            //return $http.get('/posts/' + id).then(function(res){
            //    return res.data;
            //});
        },
        addComment: function(id,comment) {
            return $http.post('/posts/' + id + '/comments', comment);
        },
        upvoteComment: function(comment) {
            return $http.put('/comments/'+ comment._id + '/upvote');
                //.success(function(data){
                //    comment.upvotes += 1;
                //});
        },
        remove : function(postId) {
            return $http.get('/delete/' + postId);
        }
    }
}]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: '/partials/home.html',controller: 'MainCtrl'})
            .when('/home', {templateUrl: '/partials/home.html',controller: 'MainCtrl'})
            .when('/posts/:postId',{templateUrl: '/partials/post-detail.html',controller: 'PostsCtrl'}).otherwise({redirectTo: "/"});
    }]);


app.controller('MainCtrl',[
'$scope','posts',
function($scope,posts) {
    posts.getAll().success(function(data) {
            $scope.posts = data;
    });
    $scope.addPost = function() {
        if(!$scope.title || $scope.title === '') {
            return;
        }
        posts.create({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0
        }).success(function(data){
            $scope.posts = data;
        });
        $scope.title = '';
        $scope.link = '';

    };

    $scope.removePost = function(id) {
        posts.remove(id).success(function(data){
            $scope.posts = data;
        });
    }

    $scope.incrementUpvotes = function(selectedPost) {
        posts.upvotes(selectedPost).success(function(){
                selectedPost.upvotes += 1;
        });

    }
}]);

app.controller('PostsCtrl',[
    '$scope','$routeParams','posts',
    function($scope,$routeParams,posts) {
        var postId = $routeParams.postId;
        posts.get($routeParams.postId).success(function(data){
            $scope.post = data;
        });
        //var id = $routeParams.postId;

        $scope.addComment = function(){
            if($scope.body === '') { return; }
            posts.addComment(postId, {
                body: $scope.body,
                author: 'user'
            }).success(function(comment) {
                $scope.post.comments.push(comment);
            });
            $scope.body = '';
        };
        $scope.incrementUpvotes = function(comment){
            posts.upvoteComment(comment).success(function(data){
                comment.upvotes += 1;
            });
        };
    }
]);
