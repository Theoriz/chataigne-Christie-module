/*

	Christie protocol for GS serie (emulating IR remote) : https://www.christiedigital.com/globalassets/resources/public/020-000814-04-christie-lit-tech-ref-gs-series-api.pdf

	author : David-Alexandre CHANEL (THEORIZ)

	Note : Values trigger can be anything you want, but commands can be mutual to all series, so only Power on, Power off and Shutter on/off for now dues to chataignes constraints

*/

var poweroffRequested = false;
var updateRate = 2; // 2 Hz

var controlsContainer;
var powerOn;
var powerOff;
var shutterToggle;

var serie;

function init()
{

	local.parameters.pass_through.setCollapsed(true);
	local.scripts.setCollapsed(true);
	script.setUpdateRate(updateRate);

	serie = local.parameters.serie;
	if(!serie) serie = local.parameters.addEnumParameter("Serie","The Christie Serie to use");
	
	serie.removeOptions();
	serie.addOption("GS","gs");
	serie.addOption("Template","template");
	// TUTO : Add your serie here

	rebuildControls();
}

function moduleCommandChanged(command)
{
	//script.log("command changed");
}

function moduleParameterChanged(param)
{

	if(param.isParameter())
	{ 
		//script.log("Module parameter changed : "+param.name+" > "+param.get());

		if(param.is(serie))
		{
			rebuildControls();						
		} else 
		{
			script.log("Module parameter triggered : " + param.name);	
		}
	}else if(param.is(powerOn)) handlePowerOn();
		else if (param.is(powerOff)) handlePowerOff();
		else if (param.is(shutterToggle)) handleShutterToggle();		

}

function update(deltaTime)
{
	// This is used for powering off two times for the gs serie
	if(poweroffRequested)
	{
		local.send("(KEY 58)\n");
		poweroffRequested = false;
		script.log("Second Power off sent : (KEY 58)");
	}
}

function moduleValueChanged(value)
{
		
}

function rebuildControls()
{
	local.parameters.removeContainer(controlsContainer.name);
	controlsContainer = null;

	var s = serie.get();
	
	// TUDO : Add your serie and parameters here

	if(s == "gs")
	{
		script.log("Loading GS serie interface...");
		controlsContainer = local.parameters.addContainer("Controls");
		powerOn = controlsContainer.addTrigger("Power on", "Power GS serie on");
		powerOff = controlsContainer.addTrigger("Power off", "Power GS serie off");
		shutterToggle = controlsContainer.addTrigger("Shutter on/off", "Toggle GS serie shutter");	
	} else if( s == "template")
	{
		script.log("Loading Template serie interface...");
		controlsContainer = local.parameters.addContainer("Controls");
		powerOn = controlsContainer.addTrigger("Power on", "Power Template serie on");
		powerOff = controlsContainer.addTrigger("Power off", "Power Template serie off");
	}  else
	{
		script.log("No specific interface to load for " + param.get() + " ");
	}

}

// Callbacks

function handlePowerOn()
{
	var s = serie.get();
	if(s == "gs")
	{
		local.send("(KEY 57)\n");
		script.log("Power on sent (KEY 57)");
	} else if( s == "template")
	{
		script.log("Power on !");
	}
}

function handlePowerOff()
{
	var s = serie.get();
	if(s == "gs")
	{
		local.send("(KEY 58)\n");
		poweroffRequested = true;
		script.log("First Power off sent : (KEY 58)");
	} else if( s == "template")
	{
		script.log("Power off !");
	}
}

function handleShutterToggle()
{
	var s = serie.get();
	if(s == "gs")
	{
		local.send("(KEY 2)\n");
		script.log("Shutter on/off sent : (KEY 2)");
	} else if( s == "template")
	{
		script.log("Shutter toggle !");
	}
}
