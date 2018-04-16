<?php

require_once('TwitterAPI.php');

header('Content-type: aplication/json');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  if(isset($_GET['label'])) {
    getAllTweets($_GET['label']);
  } else {
    echo "no hay data en GET";
  }
}


function getAllTweets($label) {
  $settings = array(
    'oauth_access_token' => "1404108066-idZvBanaVOqKWCTEoyL9j1ZC6HtKFML0DRsH9BY",
    'oauth_access_token_secret' => "VsCkCU0V104MVouN59fQsH3pg1Yyl6sf2I0qEM3sYvfa9",
    'consumer_key' => "NsuKOXBNkmGqVfh0kXjqKuwQ2",
    'consumer_secret' => "NpeOT5yiMhkOF4z843y3dKHX8eLKm7RTnl6YMZFqqq4SwDoeaT"
  );

  $url = "https://api.twitter.com/1.1/search/tweets.json";
  $getfield = "?q=" . $label . "&count=100&result_type=mixed";
  $requestMethod = 'GET';
  $twitter = new TwitterAPIExchange($settings);
  $response = $twitter->setGetfield($getfield)
               ->buildOauth($url, $requestMethod)
               ->performRequest();

  echo $response;
  //echo json_encode($response);
}

?>
