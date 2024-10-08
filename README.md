archive-tds
===========

This script stand-alone from other `pareto-anywhere` related scripts.

This runs an Express server with an API for retrieving archived IoT data from a SQL Server database using TDS.

Getting Started
------------

The following environment variables can be set.

| Environment Variable   | Description |
:------------------------|:------------|
| PORT                   | The port for this API |
| ACCESS_TOKEN           | The authorization token |
| TDS_SERVER             | The IP or domain to the MS SQL Server |
| TDS_USER               | MS SQL username |
| TDS_PASSWORD           | MS SQL password |

Run the script with the following command.

    npm start


API Calls
------------
    /archive/dynamb

The following parameters can be used in the query string of the API call.
| Query Parameter   | Description |
:-------------------|:------------|
| token             | The authorization token |
| firstId           | The first `_storeId` to retrieve from the table |
| lastId (optional) | The last `_storeId` to retrieve from the table |
| maxRows           | The maximum number of rows to retrived |

Example API call:

    http://localhost:3001/archive/dynamb?firstId=10&maxRows=25

Returns: JSON with an array of the rows returned from the database.

Example return:

    [
    {
        "_storeId": 12,
        "dynamb": "{"timestamp":1726518575439,"deviceId":"c300000ae8d8","deviceIdType":3,"batteryPercentage":100,"isMotionDetected":[true],"illuminance":465}"
    },
    {
        "_storeId": 13,
        "dynamb": "{"timestamp":1726518575767,"deviceId":"ac233faf5b98","deviceIdType":2,"batteryPercentage":100,"acceleration":[0.19921875,0.1171875,1.0078125],"isMotionDetected":[true]}"
    },
    {
        "_storeId": 14,
        "dynamb": "{"timestamp":1726518579211,"deviceId":"c300000ae8d8","deviceIdType":3,"batteryPercentage":100,"temperature":26.46875,"relativeHumidity":57.58984375,"isMotionDetected":[true],"illuminance":465}"
    }
    ]

Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2024 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.