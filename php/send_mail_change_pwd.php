<?php

########### CONFIG ###############

$recipient = $_POST['Email'];
$redirect = '../index.html?msg=send_mail';

########### CONFIG END ###########



########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   
#  1) Upload this file to your FTP Server
#  2) Send a POST rewquest to this file, including
#     [name] The name of the sender (Absender)
#     [message] Message that should be send to you
#
##################################



###############################
#
#        DON'T CHANGE ANYTHING FROM HERE!
#
#        Ab hier nichts mehr ändern!
#
###############################

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $subject = "Reset Your Password";
        $headers = "From:  noreply@developerakademie.com";

        $message = "Click on the link below to change your password! \n https://join-615.developerakademie.net/pages/SetPassword.html?mail=".$_POST['Email'];
        // mail($recipient, $subject, $_POST['message'], $headers);

        mail($recipient, $subject, $message, $headers);
        // header("Location: " . $redirect); 
        header("Location:".$redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
