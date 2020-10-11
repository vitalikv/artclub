<!DOCTYPE html>
<html lang="en">

<head>
	<title>GLTF loader</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<link type="text/css" rel="stylesheet" href="main.css">	
</head>

<body>
		
	<div>
	
		<div nameId="progress_wrap" style="position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); width: auto; padding: 20px; opacity: 0.6; border:solid 1px #b3b3b3; border-radius: 9px; background: #fff; z-index: 1;">				
			<div nameId="progress_load" style="font:32px Arial, Helvetica, sans-serif; text-align: center; color: #222;">загрузка</div>			
		</div>
		
		
		<div nameId="rightBlock" style="display: block; position: absolute; right: 50px; bottom: 80px; border:solid 1px #b3b3b3; background: #f5f5f5; z-index: 1;">

			<div style="margin-top: 15px; font:12px Arial, Helvetica, sans-serif; color: #737373;">						
				<div nameId="txt_toneMapping" style="text-align:center;">
					toneMapping 1
				</div>
				<input type="range" nameId="input_toneMapping" min="0" max="4" value="1" step="0.1">
			</div>
					
			<div style="margin-top: 15px; font:12px Arial, Helvetica, sans-serif; color: #737373;">
				<div nameId="txt_dirLight" style="text-align:center;">
					lightIntensity 1
				</div>
				<input type="range" nameId="input_dirLight" min="0" max="10" value="1" step="0.01">
			</div>
			
			<div style="margin-top: 15px; font:12px Arial, Helvetica, sans-serif; color: #737373;">
				<div nameId="txt_envMapIntensity" style="text-align:center;">
					envMapIntensity 1
				</div>
				<input type="range" nameId="input_envMapIntensity" min="0" max="1" value="1" step="0.01">
			</div>
			
			<div style="margin-top: 0px; font:12px Arial, Helvetica, sans-serif; color: #737373;">
				<div nameId="txt_metalness" style="text-align:center;">
					metalness 1
				</div>
				<input type="range" nameId="input_metalness" min="0" max="1" value="1" step="0.01">
			</div>
			
			<div style="margin-top: 0px; font:12px Arial, Helvetica, sans-serif; color: #737373;">
				<div nameId="txt_roughness" style="text-align:center;">
					roughness 0
				</div>
				<input type="range" nameId="input_roughness" min="0" max="1" value="0" step="0.01">
			</div>		
			
		</div>
		
	</div>
	
			
		
    <script type="module" src="index.js<?='?t='.time() ?>"></script>



</body>


</html>