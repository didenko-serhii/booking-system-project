# ZAP by Checkmarx Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).

## Summary of Alerts

| Risk Level    | Number of Alerts |
| ------------- | ---------------- |
| High          | 0                |
| Medium        | 0                |
| Low           | 1                |
| Informational | 1                |

## Alerts

| Name                              | Risk Level    | Number of Instances |
| --------------------------------- | ------------- | ------------------- |
| Application Error Disclosure      | Low           | 1                   |
| Authentication Request Identified | Informational | 1                   |

## Alert Detail

### [ Application Error Disclosure ](https://www.zaproxy.org/docs/alerts/90022/)

##### Low (Medium)

### Description

This page contains an error/warning message that may disclose sensitive information like the location of the file that produced the unhandled exception. This information can be used to launch further attacks against the web application. The alert could be a false positive if the error message is found inside a documentation page.

- URL: http://localhost:8000/login
  - Method: `POST`
  - Parameter: ``
  - Attack: ``
  - Evidence: `HTTP/1.1 500 Internal Server Error`
  - Other Info: ``

Instances: 1

### Solution

Review the source code of this page. Implement custom error pages. Consider implementing a mechanism to provide a unique error reference/identifier to the client (browser) while logging the details on the server side and not exposing them to the user.

### Reference

#### CWE Id: [ 200 ](https://cwe.mitre.org/data/definitions/200.html)

#### WASC Id: 13

#### Source ID: 3

### [ Authentication Request Identified ](https://www.zaproxy.org/docs/alerts/10111/)

##### Informational (High)

### Description

The given request has been identified as an authentication request. The 'Other Info' field contains a set of key=value lines which identify any relevant fields. If the request is in a context which has an Authentication Method set to "Auto-Detect" then this rule will change the authentication to match the request identified.

- URL: http://localhost:8000/login
  - Method: `POST`
  - Parameter: `username`
  - Attack: ``
  - Evidence: `password`
  - Other Info: `userParam=username
userValue=foo-bar@example.com
passwordParam=password
referer=http://localhost:8000/login`

Instances: 1

### Solution

This is an informational alert rather than a vulnerability and so there is nothing to fix.

### Reference

- [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/)

#### Source ID: 3
