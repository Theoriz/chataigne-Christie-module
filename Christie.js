/*

	Christie protocol for GS serie (emulating IR remote) : https://www.christiedigital.com/globalassets/resources/public/020-000814-04-christie-lit-tech-ref-gs-series-api.pdf

	author : David-Alexandre CHANEL (THEORIZ)

	Note : Values trigger can be anything you want, but commands can be mutual to all series, so only Power on, Power off and Shutter on/off for now dues to chataignes constraints

*/

var poweroffRequested = false;
var updateRate = 2; // 2 Hz

function init()
{
	local.parameters.pass_through.setCollapsed(true);
	local.scripts.setCollapsed(true);
	script.setUpdateRate(updateRate);
	//local.values.removeParameter("dummy");
	
	// TUTO : Add your serie here
	local.parameters.serie.removeOptions();
	local.parameters.serie.addOption("GS","gs");
	local.parameters.serie.addOption("Template","unknown");

	// Init
	local.parameters.serie.set("GS");
	loadGsSerieInterface();

	local.values.removeParameter("dummy");
}

function moduleCommandChanged(command)
{
	script.log("command changed");
}


function moduleParameterChanged(param)
{

	if(param.isParameter())
	{ 
		//script.log("Module parameter changed : "+param.name+" > "+param.get());

		if(param.name == "serie")
		{
			// clean values

			// TUTO : Add your custom interface here
			if(param.get() == "gs")
			{
				loadGsSerieInterface();
			} else
			{
				script.log("No specific interface to load for " + param.get() + " ");
			}			

		} else 
		{
			script.log("Module parameter triggered : " + param.name);	
		}
	}

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
	// TUTO : Add your commands here
	if(local.parameters.serie.get() == "gs")
	{
		if(value.name == "powerOn")
		{
			gs_powerOn();

		} else if (value.name == "powerOff")
		{
			gs_powerOff();

		} else if (value.name == "shutterOn_off")
		{
			gs_shutterOn_off();
		}
		
	} else {

		script.log("Serie " + local.parameters.serie.get() + " is not supported yet");
	} 
}

function loadGsSerieInterface()
{
	script.log("Loading GS serie interface...");
	var powerOn = local.values.addTrigger("Power on", "Power GS serie on");
	var powerOff = local.values.addTrigger("Power off", "Power GS serie off");
	var shutterToggle = local.values.addTrigger("Shutter on/off", "Toggle GS serie shutter");
}

// Add your functions here

function gs_powerOn()
{
	local.send("(KEY 57)\n");
	script.log("Power on sent (KEY 57)");
}

function gs_powerOff()
{
	local.send("(KEY 58)\n");
	poweroffRequested = true;
	script.log("First Power off sent : (KEY 58)");
}

function gs_shutterOn_off()
{
	local.send("(KEY 2)\n");
	script.log("Shutter on/off sent : (KEY 2)");
}
