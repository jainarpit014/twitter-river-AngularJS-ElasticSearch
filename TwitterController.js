searchApp.controller('Twitter', function ($scope, ejsResource) {
    //create a variable to connect to elasticsearch instance
	var ejs = ejsResource('http://localhost:9200');
		//give name of your index on elastic
    var index = 'my_twitter_river';
    var highlightPost = ejs.Highlight(["text"])
        .fragmentSize(150, "text")
        .numberOfFragments(1, "text")
        .preTags("<b>", "text")
        .postTags("</b>", "text");
		
    var statusRequest = ejs.Request()
        .indices(index)
        .types('status')
        .highlight(highlightPost);

	//this variable contains the result of search query
    $scope.resultsArr = [];

	//if queryTerm is not blank;search using ejs for matching records else blank result
    $scope.search = function() {  
        $scope.resultsArr = [];
        if (!$scope.queryTerm == '') {
            results = statusRequest
                .query(ejs.MatchQuery('_all', $scope.queryTerm))
                .doSearch();

            $scope.resultsArr.push(results);
        } else {
            results = {};
            $scope.resultsArr = [];
           
        }
    };

    $scope.renderResult = function(result){
         console.log(result);
        var resultText = "";
        if (result.highlight)
            resultText = result.highlight.text[0];
        else if (result.fields.text)
            resultText = result.fields.text;
        else
            resultText = result._id;
        
        return resultText;
    };
    // Below code is for pagination; to show more tweets(if present) when user scrolls down
    $scope.per_page = 10;
    $scope.page = 0;

    $scope.show_more = function () {
        $scope.page += 1;
        $scope.searchMore($scope.page*$scope.per_page);
    };
    $scope.searchMore = function(offset) {
        if (!$scope.queryTerm == '') {
            $scope.results = statusRequest
                .query(ejs.MatchQuery('_all', $scope.queryTerm))
                .from(offset)
                .doSearch();
            $scope.resultsArr.push($scope.results);
        }
    };
});
