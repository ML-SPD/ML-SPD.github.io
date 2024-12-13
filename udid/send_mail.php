<?php
// include("PHPMailerAutoload.php"); //匯入PHPMailer類別 
use PHPMailer\PHPMailer\PHPMailer;
require 'vendor/autoload.php';
 
$udid = $_GET['udid'];
$version = $_GET['version'];
$device = $_GET['device'];
$user = $_GET['user'];

$C_message=nl2br("iOS UDID Number : ".$udid.
				"\r\nDevice : ".$device.
				"\r\nVersion : ".$version.
				"\r\nSender : ".$user );

$mail= new PHPMailer(); //建立新物件   
$mail->IsSMTP(); //設定使用SMTP方式寄信   
$mail->SMTPAuth = true; //設定SMTP需要驗證
// $mail->SMTPSecure = "ssl"; // Gmail的SMTP主機需要使用SSL連線     
$mail->Host = "thyme.com.tw"; //設定SMTP主機   
$mail->Port = 25; //設定SMTP埠位，預設為25埠  
$mail->CharSet = "utf-8"; //設定郵件編碼   
 
// $mail->Username = "ios.udid.main@mgmail.com"; //設定驗證帳號   
// $mail->Password = "dr0wss@P"; //設定驗證密碼   
$mail->Username = "mantisbt@thyme.com.tw"; //設定驗證帳號   
$mail->Password = "mantisbt"; //設定驗證密碼   
 
 
$mail->From = "mantisbt@thyme.com.tw"; //設定寄件者信箱   
$mail->FromName = "iOS Developer MAIN_RD3"; //設定寄件者姓名   
 
$mail->Subject = "iOS UDID Number from ".$user; //設定郵件標題   
$mail->Body = $C_message; //設定郵件內容 
$mail->IsHTML(true); //設定郵件內容為HTML   
$mail->AddAddress("marslin@thyme.com.tw", "mars"); //設定收件者郵件及名稱   
if(!$mail->Send()) {   
echo "Mailer Error: " . $mail->ErrorInfo;   
} else {   
echo "Message sent!";   
}
?>