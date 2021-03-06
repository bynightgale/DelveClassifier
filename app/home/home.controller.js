(function () {
  'use strict';

  angular.module('officeAddin')
    .controller('homeController', ['$scope','$document', 'dataService', 'proxyHackUrl', homeController]);

  /**
   * Controller constructor
   */
  function homeController($scope, $document, dataService,  proxyHackUrl) {
    var vm = this;
    vm.searchQuery = '';
    vm.searchQueryKeyDown = searchQueryKeyDown;
    vm.hasSearched = false;
    vm.loading = false;
    vm.documents = [];
    
    vm.getAllBoards = getAllBoards;
    vm.getFilteredBoards = getFilteredBoards;

    activate();

    function activate() {
      // if (Office.context.document) {
      //   Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, selectedTextChanged);
      // }

      

      vm.getAllBoards();

       var iframe = $document[0].createElement('iframe');
      iframe.frameBorder=0;
      iframe.width="1px";
      iframe.height="1px";
      iframe.id="spProxy";
      iframe.setAttribute("src", proxyHackUrl);
      $document[0].getElementById("content-footer").appendChild(iframe);


      //getDocumentLocation();
    }

    

    // function selectedTextChanged() {
    //   Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
    //     function (result) {
    //       if (result.status === Office.AsyncResultStatus.Succeeded) {
    //         vm.searchQuery = result.value;
    //         $scope.$apply();
    //       }
    //       else {
    //         console.error(result.error.message);
    //       }
    //     });
    // }

    function searchQueryKeyDown($event) {
      var query = event.target.value.toLowerCase();
      if (/*$event.keyCode === 13 ||*/ query.length > 2) {
        
        $(".board").each(function (i, b) {
          var brd = $(b);
          if (brd.find(".board-title").text().toLowerCase().indexOf(query) >= 0){
            brd.show();
          }
          else{
            brd.hide();
          }
        });
        //vm.getFilteredBoards(vm.searchQuery);
      }
      else {
        $(".board").each(function (i, b) {
          var brd = $(b);
          brd.show();
        });
      }
    }

    function getFilteredBoards(query) {
      vm.loading = true;
      vm.documents.length = 0;

      dataService.getFilteredBoards(query).then(function (documents) {
        documents.forEach(function (document) {
          vm.documents.push(document);
        });

        vm.loading = false;
        vm.hasSearched = true;
      });
    }

    function getAllBoards() {
      vm.loading = true;
      vm.documents.length = 0;

      dataService.getAllBoards().then(function (documents) {
        documents.forEach(function (document) {
          vm.documents.push(document);
        });

        vm.loading = false;
        vm.hasSearched = true;
      });
    }
  }

})();