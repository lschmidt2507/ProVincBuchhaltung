<!DOCTYPE html>

<html>
    <head>
        <title>Ultimate Guitar Scraper</title>
        <script type="text/javascript" src="main.js"></script>
    </head>
    <body>
        <form action="./index.php" method="get">
            <label for="lname">URL</label><br>
            <input type="url" id="lname" name="url"><br>
            <input type="submit" value="Laden">
        </form><br><br>
        <?php
        
        # curl.php

        if (isset($_GET['url'])){


        // Initialize a connection with cURL (ch = cURL handle, or "channel")
        $ch = curl_init();

        $options = array(

            CURLOPT_CUSTOMREQUEST  =>"GET",        //set request type post or get
            CURLOPT_POST           =>false,        //set to GET
            CURLOPT_COOKIEFILE     =>"cookie.txt", //set cookie file
            CURLOPT_COOKIEJAR      =>"cookie.txt", //set cookie jar
            CURLOPT_RETURNTRANSFER => true,     // return web page
            CURLOPT_HEADER         => false,    // don't return headers
            CURLOPT_FOLLOWLOCATION => true,     // follow redirects
            CURLOPT_ENCODING       => "",       // handle all encodings
            CURLOPT_AUTOREFERER    => true,     // set referer on redirect
            CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
            CURLOPT_TIMEOUT        => 120,      // timeout on response
            CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
        );

        curl_setopt_array( $ch, $options );

        // Set the URL
        curl_setopt($ch, CURLOPT_URL, $_GET['url']);

        // Return the response instead of printing it out
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // Send the request and store the result in $response
        $response = curl_exec($ch);

        echo substr($response,10);

        // Close cURL resource to free up system resources
        curl_close($ch);

        }
        ?>
    </body>
</html>
