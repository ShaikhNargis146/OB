myApp.factory('apiService', function ($http, $q, $timeout) {
    return {

        // This is a demo Service for POST Method.
        getDemo: function (formData, callback) {
            $http({
                url: adminurl + 'demo/demoService',
                method: 'POST',
                data: formData
            }).success(callback);
        },
        // This is a demo Service for POST Method.

        getAccounts: function (formData, callback) {
            $http({
                url: adminurl + 'OBdemo/getMyAccountsOauth',
                method: 'POST',
                data: formData
            }).then(callback);
        }

    };
});