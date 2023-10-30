<?php

if (isset($_POST)) {
    $data = json_decode(file_get_contents('php://input'), true);

    $to = $data['mail'];
    $subject = "Welcome to Join";

    $message = 
'Dear'.$data['name'].',

your registration is successfully completed.
Best regards

your join team';

    $success = mail($to, $subject, $message);
    if ($success) {
        echo "Success!";
    }
    else {
        echo "Fail";
    }
}
?>