WorkshopMgmtApp.factory('CreateWorkshopService', [
    '$http', 'dotnetapi', function ($http, dotnetapi) {

        AdminObj = {};

        AdminObj.AddWorkshop = function (obj) {
            var AdminLogin;

            AdminLogin = $http({
                method: 'Post', url: dotnetapi + 'Account/AddWorkshop', data: obj,
                headers: { 'Culture': localStorage.getItem("lang") }
            }).
                then(function (response) {
                    return response;
                }, function (error) {
                    return error;
                });

            return AdminLogin;

        };
        return AdminObj;

    }]);

WorkshopMgmtApp.controller('CreateWorkshopController', [
    '$scope', '$rootScope', 'CreateWorkshopService', '$cookies', 'dotnetfilepath', '$location', '$routeParams', '$timeout',
    function ($scope, $rootScope, CreateWorkshopService, $cookies, dotnetfilepath, $location, $routeParams, $timeout) {

        $scope.$watch('Logo', function (Logo) {
            if (Logo != undefined) {
                var stringLength = Logo.length - 'data:image/png;base64,'.length;
                var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
                var sizeInKb = sizeInBytes / 1000;

                if (sizeInKb > 1999) {
                    $scope.Logo = undefined;
                    alert('Please select File Less than 2MB');
                    return;
                }
                $scope.result = Logo.substring(0, 4);
                if ($scope.result != "http") {
                    var file = Logo.split(';')[0]
                    var filetype = file.split('/')[1];
                    if (filetype == "png" || filetype == "jpg" || filetype == "jpeg") {

                    }
                    else {
                        $scope.Logo = null;
                        alert("Can only accept .png or .jpg files", { title: 'Error!' });
                    }
                }
            }
        }, true);
        $scope.RegisterWorkshop = async function (obj, valid) {

            if (valid) {

                if ($scope.Logo == null || $scope.Logo == '' || $scope.Logo == undefined) {
                    obj.Logo = "";
                    alert('Please select File Less than 2MB');
                    return;
                }
                else {

                    var stringLength = $scope.Logo.length - 'data:image/png;base64,'.length;

                    var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
                    var sizeInKb = sizeInBytes / 1000;

                    if (sizeInKb > 1999) {
                        $scope.Logo = undefined;
                        alert('Please select File Less than 2MB');
                        return;
                    }
                    else {
                        $scope.result = $scope.Logo.substring(0, 4);
                        if ($scope.result != "http") {
                            var file = $scope.Logo.split(';')[0]
                            var filetype = file.split('/')[1];
                            if (filetype == "png" || filetype == "jpg" || filetype == "jpeg") {

                                obj.Logo = $scope.Logo;
                            }
                            else {
                                $scope.Logo = null;
                                alert("Can only accept .png or .jpg files", { title: 'Error!' });
                                return;
                            }
                        }
                    }

                }





                if (obj.Password == obj.ConfirmPassword) {

                    const file = document.querySelector('#CRDoc').files[0];
                    if (file != undefined) {
                        const toBase64 = file => new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = reject;
                        });

                        obj.CR = await toBase64(file);
                    }

                    obj.OwnerId = 1;
                    obj.MobileNo = obj.MobileNo.toString();
                    
                
                    

                    CreateWorkshopService.AddWorkshop(obj).then(function (result) {
                        if (result.data.isSuccess) {
                            $scope.Workshop = result.data.Data;
                            $location.path("/Workshop");

                        }
                        else {
                            $scope.serverErrorMsgs = result.data.message;
                            alert($scope.serverErrorMsgs);
                        }

                    });
                }
                else {
                    alert("Password and Confirm Password should be match");
                }
            }

        }

    }]);