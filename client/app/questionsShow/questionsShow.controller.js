'use strict';

angular.module('paizaqaApp')
  .controller('QuestionsShowCtrl', function ($scope, $http, $stateParams, Auth, $location) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.newAnswer = {};
    $scope.newComment = {};

    var loadQuestions = function(){
      $http.get('/api/questions/' + $stateParams.id).success(function(question) {
        $scope.question = question;
        console.log("question", question);
      });
    }
    loadQuestions();

    $scope.submitAnswer = function() {
      $http.post('/api/questions/' + $stateParams.id + '/answers', $scope.newAnswer).success(function(){
        loadQuestions();
        $scope.newAnswer = {};
        $scope.editNewAnswer = false;
      })
    };
    $scope.questionComment = {};
    $scope.submitComment = function() {
      $http.post('/api/questions/' + $stateParams.id + '/comments', $scope.newComment).success(function(){
        loadQuestions();
        $scope.newComment = {};
        $scope.editNewComment = false;
      })
    };
    $scope.submitAnswerComment = function(answer) {
      $http.post('/api/questions/' + $stateParams.id + '/answers/' + answer._id + '/comments', answer.newAnswerComment).success(function(){
        loadQuestions();
      })
    };

    $scope.deleteQuestion = function() {
      $http.delete('/api/questions/' + $stateParams.id).success(function(){
        $location.path('/');
      });
    };
    $scope.deleteAnswer = function(answer) {
      $http.delete('/api/questions/' + $stateParams.id + '/answers/' + answer._id).success(function(){
        loadQuestions();
      });
    };
    $scope.deleteComment = function(comment) {
      $http.delete('/api/questions/' + $stateParams.id + '/comments/' + comment._id).success(function(){
        loadQuestions();
      });
    };
    $scope.deleteAnswerComment = function(answer, answerComment) {
      $http.delete('/api/questions/' + $stateParams.id + '/answers/' + answer._id + '/comments/' + answerComment._id).success(function(){
        loadQuestions();
      });
    };

    $scope.isOwner = function(obj){
      return Auth.isLoggedIn() && obj && obj.user && obj.user._id === Auth.getCurrentUser()._id;
    }

    /*
    $scope.isMyQuestion = function(question){
      return Auth.isLoggedIn() && question && question.user && question.user._id === Auth.getCurrentUser()._id;
    }
    $scope.isMyComment = function(questionComment){
      return Auth.isLoggedIn() && questionComment && questionComment.user && questionComment.user._id === Auth.getCurrentUser()._id;
    }
    $scope.isMyAnswer = function(answer){
      return Auth.isLoggedIn() && answer && answer.user && answer.user._id === Auth.getCurrentUser()._id;
    }
    $scope.isMyAnswerComment = function(answerComment){
      return Auth.isLoggedIn() && answerComment && answerComment.user && answerComment.user._id === Auth.getCurrentUser()._id;
    }
    */
    $scope.isStar = function(obj){
      return Auth.isLoggedIn() && obj && obj.stars && obj.stars.indexOf(Auth.getCurrentUser()._id)!==-1;
    }
    $scope.star = function(subpath) {
      $http.put('/api/questions/' + $scope.question._id + subpath + '/star').success(function(){
        loadQuestions();
      });
    };
    $scope.unstar = function(subpath) {
      $http.delete('/api/questions/' + $scope.question._id + subpath + '/star').success(function(){
        loadQuestions();
      });
    };
  });
