```
deno task start
```

## Phase 1

| Date       | Used hours | Subject(s)                                            | output                                                                                                                         | notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 16.11.2024 | 3          | writing sql and relationships                         | gained sql writing skills and basic knowledge of databases                                                                     | writing sql with orm drizzle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 17.11.2024 | 2          | creating an environment for the project and structure | worked with docker and deno, gained knowledge about working with these tools                                                   | I tried to deploy the project with docerfile and docker compose, but it didn't work properly with deno, so I had to do everything from scratch                                                                                                                                                                                                                                                                                                                                                                        |
| 19.11.2024 | 2          | code refactoring                                      | refactoring the code and changing the structure of the project, as I faced difficulties in implementing some libraries in deno | refactored the code based on your repository, and chatgpt, as my approach did not work recording                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 21.11.2024 | 2          | testing the project for vulnerabilities               | gained knowledge of testing web applications for vulnerabilitieslecture                                                        | [report 1](https://github.com/didenko-serhii/booking-system-project/blob/main/2024-11-22-ZAP-Report-.md)(2 alerts) I have an alert in my report with a login error \\ Bugfix: I fixed the login handler, because I made a mistake in its creation and I got a null in the response, but the expected string was [report 2](https://github.com/didenko-serhii/booking-system-project/blob/main/2024-11-23-ZAP-Report-.md)(1 alert) I can't fix this alert because I read that it will disappear only when I have https |

## Phase 2

| Date      | Used hours | Subject(s)                                                             | output                                                                                                                                                                                                                       |
| --------- | ---------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6.12.2024 | 2          | Implement the login page, logging feature, GDPR pseudonyms, index page | I gained knowledge about gdpr and how to implement it, and also understood how to develop projects with routing                                                                                                              |
| 7.12.2024 | 1          | functionality test and vulnerability test                              | [report](https://github.com/didenko-serhii/booking-system-project/blob/main/tests/Phase%202/2024-12-07-ZAP-Report-.md) I did only one test because I had only one alert from the previous tests and I was not able to fix it |

## Phase 3

| Date      | Used hours | Subject(s) | output |
| --------- | ---------- | ---------- | ------ |
| 7.12.2024 | 1          |            |        |

## Phase 4

| Date      | Used hours | Subject(s)                                                | output                                                                           |
| --------- | ---------- | --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 7.12.2024 | 1          | Add the Privacy Policy,the terms of service, account page | I learned to implement authentication and manage legal policy pages effectively. |

### Answer to Questions

#### 1. Our system does not use consent (except for accepting the terms of service, but this is a slightly different matter). Is this good? Explain (100 words)

Not using consent extensively can simplify the user experience, especially in a system designed for specific functionalities like booking resources. However, this approach has drawbacks. Lack of explicit consent for data usage can lead to user distrust and potential legal issues, particularly in jurisdictions with stringent data protection laws (e.g., GDPR). Consent ensures users are aware of how their data is used, promoting transparency and accountability. While our system operates within a limited scope, adding consent mechanisms for actions like data collection, analytics, or email communications would align with best practices and foster user trust.

#### 2. Choose an example page where consent is required. Tell us which one you chose. Tell us why consent is required? (100 words)

I chose the "newsletter subscription" page as an example. Consent is required because subscribing to a newsletter involves collecting and processing a user's email address for sending periodic updates or promotional content. Under data protection regulations like GDPR, this constitutes personal data processing, which requires explicit user consent. Users must willingly opt-in to receive communications, and the system must ensure they understand how their data will be used, stored, and their rights to withdraw consent. This prevents unsolicited communication and aligns with legal and ethical standards for data handling.
