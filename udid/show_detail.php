<?php 
 	$deviceProduct = $_GET['DEVICE_PRODUCT'];
  	$deviceName = "";  
  	$file = 'Apple_mobile_device_types.txt';

	// get the file contents, assuming the file to be readable (and exist)
	$contents = file_get_contents($file);
	// escape special characters in the query
	$pattern = preg_quote($deviceProduct, '/');
	// finalise the regular expression, matching the whole line
	$pattern = "/^.*$pattern.*\$/m";
	// search, and store all matching occurences in $matches
	if(preg_match_all($pattern, $contents, $matches)){
   		$deviceName = implode("", $matches[0]);
   		$deviceName = substr($deviceName,strlen($deviceProduct)+3);
	}
	else{
   		$deviceName = $deviceProduct;
	}
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no" name="viewport" id="viewport" />

<script type="text/javascript">
	function getUrlVars() {
    	var vars = {};
	    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    	    vars[key] = value;
	    });
    	return vars;
	}
	
	function getUdid() {
		
	}

	function sendMail() {
		if(document.getElementById("User") != null) {
			if (document.getElementById("User").value === "") {
				// user未輸入
// 				console.log('no input.');
				alert("請輸入裝置持有者！");
			} else {
				var udid = getUrlVars()["UDID"];
				var version = getUrlVars()["DEVICE_VERSION"];
				var device=document.getElementById("Device").value;
				var user=document.getElementById("User").value;
				
				if (window.XMLHttpRequest) {
    			// code for IE7+, Firefox, Chrome, Opera, Safari
    				xmlhttp=new XMLHttpRequest();
  				} else { // code for IE6, IE5
    				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
 				}
  				xmlhttp.onreadystatechange=function() {
    				if (this.readyState==4 && this.status==200) {
      					// document.getElementById("txtHint").innerHTML=this.responseText;
//       					console.log(this.responseText);
      					alert(this.responseText);
    				}
  				}
  				xmlhttp.addEventListener("progress", updateProgress);
  				xmlhttp.addEventListener("load", transferComplete);
  				xmlhttp.addEventListener("error", transferFailed);
  				xmlhttp.addEventListener("abort", transferCanceled);
  
  				xmlhttp.open("GET","send_mail.php?udid="+udid+"&version="+version+"&device="+device+"&user="+user,true);  				
  				xmlhttp.send();
			} 
		}
	}
	
	function updateProgress (oEvent) {
  		if (oEvent.lengthComputable) {
    		var percentComplete = oEvent.loaded / oEvent.total;
    		// ...
  		} else {
    		// Unable to compute progress information since the total size is unknown
  		}
	}

	function transferComplete(evt) {
  		console.log("The transfer is complete.");
	}

	function transferFailed(evt) {
  		console.log("An error occurred while transferring the file.");
	}

	function transferCanceled(evt) {
  		console.log("The transfer has been canceled by the user.");
	}
</script>
 
<title>名漢科技 iOS裝置線上取得UDID</title>
<body>
<div id="content">

<p><span style="font-size:18px;">UDID:<input style="text" name="UDID" size="50" value="<?php echo $_GET['UDID']; ?>" readonly="readonly" /> </span></p>
<p><span style="font-size:18px;">Device:<input style="text" id="Device" name="Device" size="50" value="<?php echo $deviceName; ?>" readonly="readonly" /> </span></p>
<p><span style="font-size:18px;">裝置持有者:<input style="text" id="User" name="User" size="50" value="" /> </span></p>

<!-- <p><a class="buttons" href="get_mobileconfig.php" target="_blank"><span style="font-size:18px;">1.點擊安裝憑證，已獲取您裝置的UDID</span></a></p> -->
<!-- 
<p><a class="buttons" href="send_mail.php?udid=<?php echo $_GET['UDID']; ?>
								&device=<?php echo $deviceName; ?>
								&version=<?php echo $_GET['DEVICE_VERSION']; ?>
								&sender=<?php echo $deviceName; ?>"" target="_blank"><span style="font-size:18px;">2.將UDID寄給開發者</span></a></p>
 -->
<button onclick="location.href='https://maintis.thyme.com.tw/app/udid/get_mobileconfig.php'" style="font-size:18px;" >1.點擊安裝憑證，已獲取您裝置的UDID</button>	
<br>
<br>
<!--<button onclick="sendMail()" style="font-size:18px;" >2.將UDID寄給開發者</button>			-->

</div>
</body>
</html>