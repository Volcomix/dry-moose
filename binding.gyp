{
    "targets": [
        {
      	    "target_name": "ta-lib",
      	    "sources": [ "addon/ta-lib.cc" ],
            "conditions": [
                ["OS==\"linux\"", {
                    "include_dirs": [
                        "lib/ta-lib/include"
                    ],
                    "link_settings": {
                        "libraries": [
                            '../lib/ta-lib/lib/libta_libc_csr.a'
                        ]
                    }
                }],
                ["OS==\"win\"", {
                    "include_dirs": [
                        "..\\..\\..\\Downloads\\ta-lib\\c\\include"
                    ],
                    "link_settings": {
                        "libraries": [
                            "..\\..\\..\\..\\Downloads\\ta-lib\\c\\lib\\ta_libc_cmr.lib"
                        ]
                    }
                }],
                ["OS==\"mac\"", {
                    "include_dirs": [
                        "/usr/local/Cellar/ta-lib/0.4.0/include/ta-lib"
                    ],
                    "link_settings": {
                        "libraries": [
                            "-lta_lib"
                        ]
                    }
                }]
            ]
        }
  	]
}