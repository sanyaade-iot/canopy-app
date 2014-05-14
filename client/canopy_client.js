function CanopyClient() {
    this.getLoggedInUsername = function(onSuccess, onError) {
        $.ajax({
            type: "GET",
            dataType : "json",
            url: "http://canopy.link:8080/me",
            xhrFields: {
                 withCredentials: true
            },
            crossDomain: true
        })
        .done(function(data, textStatus, jqXHR) {
            if (onSuccess != null)
                onSuccess(data['username']);
        })
        .fail(function() {
            if (onError != null)
                onError();
        });
        
    }

    this.login = function(username, password, onSuccess, onError) {
        $.ajax({
            type: "POST",
            dataType : "json",
            url: "http://canopy.link:8080/login",
            data: JSON.stringify({username : username, password : password}),
            xhrFields: {
                 withCredentials: true
            },
            crossDomain: true
        })
        .done(function() {
            onSuccess();
        })
        .fail(function() {
            onError();
        });
    }

    this.logout = function(onSuccess, onError) {
        $.ajax({
            type: "POST",
            dataType : "json",
            url: "http://canopy.link:8080/logout",
            xhrFields: {
                 withCredentials: true
            },
            crossDomain: true
        })
        .done(function() {
            if (onSuccess != null)
                onSuccess();
        })
        .fail(function() {
            if (onError != null)
                onError();
        });
    }

    this.createAccount = function(username, email, password, password_confirm, onSuccess, onError) {
        $.ajax({
            type: "POST",
            dataType : "json",
            url: "http://canopy.link:8080/create_account",
            data: JSON.stringify({username : username, email: email, password : password, password_confirm: password_confirm}),
            xhrFields: {
                 withCredentials: true
            },
            crossDomain: true
        })
        .done(function() {
            if (onSuccess != null)
                onSuccess();
        })
        .fail(function() {
            if (onError != null)
                onError();
        });
    }

    this.fetchDevices = function(onSuccess, onError) {
        $.ajax({
            type: "GET",
            dataType : "json",
            url: "http://canopy.link:8080/devices",
            xhrFields: {
                 withCredentials: true
            },
            crossDomain: true
        })
        .done(function(data, textStatus, jqXHR) {
            if (onSuccess != null)
                onSuccess(data);
        })
        .fail(function() {
            if (onError != null)
                onError();
        });
    }
}

/*
    {
        "devices" : [
            {
                "device_id" : UUID,
                "friendly_name" : "mydevice",
                "device_class" : {
                    "canopy.tutorial.sample_device_1" : {
                        "cpu" : {
                            "category" : "sensor",
                            "datatype" : "float32",
                            "min_value" : 0.0,
                            "max_value" : 1.0,
                            "description" : "CPU usage percentage"
                        },
                        "reboot" : {
                            "category" : "control",
                            "control_type" : "trigger",
                            "datatype" : "boolean",
                            "description" : "Reboots the device"
                        }
                    }
                }
            }
        ]
    }
*/
function CanopyUtil_GetDeviceControls(deviceObj) {
}
