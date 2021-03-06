/* @preserve
 *
 * angular-bootstrap-file
 * https://github.com/itslenny/angular-bootstrap-file-field
 *
 * Version: 0.1.3 - 02/21/2015
 * License: MIT
 */

angular.module('bootstrap.fileField',['toastr'])
.directive('fileField', function() {
  return {
    require:'ngModel',
    restrict: 'E',
    link: function (scope, element, attrs, ngModel) {
        //set default bootstrap class
        if(!attrs.class && !attrs.ngClass){
            element.addClass('btn');
        }

        var fileField = element.find('input'),
            executables = ['.EXE', '.DMG', '.PIF','.APPLICATION', '.GADGET', '.MSI', '.MSP', '.COM', '.SCR', '.HTA', '.CPL', '.MSC', '.JAR', '.BAT', '.CMD', '.VB', '.VBE', '.JS', '.JSE', '.WS', '.WSF', '.WSC', '.WSH', '.PS1', '.PS1XML', '.PS2', '.PS2XML', '.PSC1', '.PSC2', '.MSH', '.MSH1', '.MSH2','.MSHXML', '.MSH1XML', '.MSH2XML', '.SCF', '.LNK', '.INF', '.REG', '.DOCM', '.DOTM', '.XLSM', '.XLTM', '.XLAM', '.PPTM', '.POTM', '.PPAM', '.PPSM', '.SLDM','.ACTION', '.APK', '.APP', '.COMMAND', '.CSH', '.IPA', '.PKG', '.KSH', '.OSX', '.OUT', '.PRG', '.RUN', '.WORKFLOW'],
            enableFileSizeLimit = attrs.enableFileSizeLimit || true,
            fileSizeLimit = attrs.maxFileSize || 5 * 1024 * 1024,
            restrictExecutables = attrs.restrictExecutables || true;

        function formatBytes(bytes) {
            if(bytes < 1024) return bytes + " Bytes";
            else if(bytes < 1048576) return(bytes / 1024).toFixed(0) + " KB";
            else if(bytes < 1073741824) return(bytes / 1048576).toFixed(0) + " MB";
            else return(bytes / 1073741824).toFixed(0) + " GB";
        };

        fileField.bind('change', function(event){
            scope.$evalAsync(function () {
                var file = event.target.files[0],
                    ext = file.name.substr(file.name.lastIndexOf('.')).toUpperCase();
                if (enableFileSizeLimit && file.size > fileSizeLimit) {
                    event.target.value = '';
                    event.target.focus();
                    toastr.error('File cannot be larger than ' + formatBytes(fileSizeLimit), 'Error');
                }else if (restrictExecutables && _.indexOf(executables, ext) > -1){
                    event.target.value = '';
                    event.target.focus();
                    toastr.error('File cannot be an executable', 'Error');
                }else {
                    ngModel.$setViewValue(file);
                    if (attrs.preview) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            scope.$evalAsync(function () {
                                scope[attrs.preview] = e.target.result;
                            });
                        };
                        reader.readAsDataURL(file);
                    }
                }
            });
        });
        fileField.bind('click',function(e){
            e.stopPropagation();
        });
        element.bind('click',function(e){
            e.preventDefault();
            fileField[0].click()
        });        
    },
    template:'<button type="button"><ng-transclude></ng-transclude><input type="file" style="display:none"></button>',
    replace:true,
    transclude:true
  };
});