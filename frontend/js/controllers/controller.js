myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal, $state, apiService) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.mySlides = [
            'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
            'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
            'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
            'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
        ];
        var abc = _.times(100, function (n) {
            return n;
        });

        var i = 0;
        $scope.buttonClick = function () {
            i++;
            console.log("This is a button Click");
        };

        $scope.userDetails = function () {
            $scope.userDetailModal = $uibModal.open({
                animation: true,
                templateUrl: "views/modal/user.html",
                scope: $scope,
                size: 'lg',
                backdropClass: 'black-drop'
            });
        }
        $scope.closeModal = function () { // to close modals for ALL OTP
            $scope.userDetailModal.close();
            $scope.template = TemplateService.getHTML("content/account.html");
        };

        $scope.submitForm = function (data) {
            apiService.getAccounts(data, function (res) {
                console.log("data", res);
                $scope.userDetailModal.close();
                $scope.myAccountList = res.data.data;
                $scope.template = TemplateService.getHTML("content/account.html");
            });
        }

    })

    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/form.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        // $scope.data = {
        //     name: "Chintan",
        //     "age": 20,
        //     "email": "chinyan@wohlig.com",
        //     "query": "query"
        // };
        $scope.submitForm = function (data) {
            console.log("This is it");
            return new Promise(function (callback) {
                $timeout(function () {
                    callback();
                }, 5000);
            });
        };
    })
    .controller('AccountCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, apiService) {
        // $scope.template = TemplateService.getHTML("content/account.html");
        TemplateService.title = "Account Details"; // This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        var data = {};
        apiService.getAccounts(data, function (res) {
            console.log("data", res);
            $scope.myAccountList = res.data.data;
            $scope.template = TemplateService.getHTML("content/account.html");
        });
        $scope.userDetails = function () {
            $scope.userDetailModal = $uibModal.open({
                animation: true,
                templateUrl: "views/modal/user.html",
                scope: $scope,
                size: 'lg',
                backdropClass: 'black-drop'
            });
        }
        $scope.closeModal = function () { // to close modals for ALL OTP
            $scope.userDetailModal.close();
        };
    })
    .controller('GridCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/grid.html");
        TemplateService.title = "Grid"; // This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })

    // Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });