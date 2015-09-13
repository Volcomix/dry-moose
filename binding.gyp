{
    "targets": [
        {
      	    "target_name": "ta-lib",
      	    "sources": [ "addon/ta-lib.cc" ],
            "include_dirs": [
                "/usr/include/ta-lib",
            ],
            "link_settings": {
                "libraries": [
                    "-lta_lib"
                ]
            }
        }
  	]
}