(function () {
  'use strict';

  angular.module('officeAddin')
    .controller('boardController', ['$scope', '$document', 'dataService', 'azureOrigin', boardController]);

  /**
   * Controller constructor
   */
  function boardController($scope, $document, dataService, azureOrigin) {
    var vm = this;
    vm.selected = false;

    vm.loading = false;
    vm.loaded = false;
    vm.visibleInFilter = true;
    $scope.boardDocuments = [];
    vm.currentBoard = null;
     vm.noDocs = function(){return $scope.boardDocuments.length == 0;}
    
    vm.docLocation = "";

    vm.getBoardDocuments = getBoardDocuments;
    $scope.toggleBoardSelected = toggleBoardSelected;
    $scope.expandCollapsBoard = expandCollapsBoard;
      $scope.loadBoardDocuments = loadBoardDocuments;
    activate();

    function activate() {
      // if (Office.context.document) {
      //   Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, selectedTextChanged);
      // }
     // vm.getAllBoards();

   
      getDocumentLocation();
    }


function getDocumentLocation()
    {
      //Note: This will return "undefined" when the document is embedded in a webpage.
      Office.context.document.getFilePropertiesAsync(
        function (asyncResult) {
          if (asyncResult.status == "failed") {
            //TODO: later.
            //showMessage("Action failed with error: " + asyncResult.error.message);
          } else {
            vm.docLocation = asyncResult.value.url;
          }
        }
      );
    }

     function loadBoardDocuments(board){
    getBoardDocuments(board);
     }         
     
 function expandCollapsBoard(event){
       expandCollapsBoardUI(event); 
//getBoardDocuments(document);
     }            

    function toggleBoardSelected(event, document){
      event.originalEvent.preventDefault();
      var elem = event.currentTarget;
      $(elem).parents(".board").toggleClass('selected');
      vm.selected = !vm.selected;

      var message = {board: document.title, docLocation: vm.docLocation};

      $document[0].getElementById("spProxy").contentWindow.postMessage(JSON.stringify(message), azureOrigin);
    }

    function expandCollapsBoardUI(event) {
        event.originalEvent.preventDefault();
        event.stopPropagation();
        var elem = event.currentTarget;
      
        var $board = $(elem).parents(".board");

        if ($board.hasClass('opened')) {
            $board.find(".board-icon .ms-Icon").removeClass('ms-Icon--caretDownRight').addClass('ms-Icon--caretRightOutline');
            $board.find('.board-files').hide('fast');
        } else {
            $board.find(".board-icon .ms-Icon").removeClass('ms-Icon--caretRightOutline').addClass('ms-Icon--caretDownRight');
            $board.find('.board-files').show('fast');
        }

        $board.toggleClass('opened');
        //$board.siblings('.board').find('.board-icon .ms-Icon').removeClass('ms-Icon--caretDownRight').addClass('ms-Icon--caretRightOutline');
        //$board.siblings('.board').removeClass('opened');
        //$board.siblings('.board').find('.board-files').hide('fast');
        return false;
    }

    function getBoardDocuments(board) {
      if (vm.loaded || vm.loading) return;
      vm.loading = true;
      $scope.boardDocuments.length = 0;

      dataService.getBoardDocuments(board).then(function (documents) {
        documents.forEach(function (document) {
          $scope.boardDocuments.push(document);
          if (document.url == vm.docLocation){
             vm.selected = true;
          }
        });

        vm.loading = false;
        vm.loaded = true;
      });
    }
  }

})();