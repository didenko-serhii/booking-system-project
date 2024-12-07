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
| 7.12.2024 | 1          |independent search for vulnerabilities  |In my opinion, searching for vulnerabilities on your own is a good idea for learning something on your own, because when you look for them, you can find ways to solve them        |

**I didn't see any new alerts in my program, so I decided to look for what could be wrong and what could be improved**

## 1. **SQL Injection Risk in Queries**

- **What is wrong?**  
  Raw SQL queries are used without parameterized inputs in multiple places, such as in `getUserUUID`, `getResources`, and `registerReservation`. This makes the system vulnerable to SQL injection attacks.
- **How did you find it?**  
  By reviewing the code, I identified direct concatenation of SQL statements without using prepared statements or parameterized queries.
- **How should it work/What should be fixed?**  
  Replace raw SQL queries with parameterized queries or prepared statements to sanitize user input and prevent SQL injection.

---

## 2. **Authorization Issues for Resource and Reservation Management**

- **What is wrong?**  
  The `handleReservationForm` and `getResources` endpoints lack robust role-based access control. Any logged-in user can access administrative functionalities, such as managing resources.
- **How did you find it?**  
  By reviewing the access logic in the endpoints and confirming that session roles are not consistently validated.
- **How should it work/What should be fixed?**  
  Implement strict role-based access control, ensuring that only administrators can access sensitive endpoints like `registerResource`.

---

## 3. **Sensitive Information Exposure**

- **What is wrong?**  
  The `getReservationsWithUser` function exposes reserver usernames in the table, which can be seen by any authenticated user. This leaks sensitive information unnecessarily.
- **How did you find it?**  
  By reviewing the HTML output generated for logged-in users on the index page.
- **How should it work/What should be fixed?**  
  Remove reserver usernames from the public table or restrict this information to administrators only.

---

## 4. **Validation Gaps in Input Data**

- **What is wrong?**  
  While schemas are used for validation, some fields such as `reservation_start` and `reservation_end` in `registerReservation` are not validated against realistic constraints (e.g., ensuring the start date is before the end date).
- **How did you find it?**  
  By reviewing the input validation logic in `registerReservation`.
- **How should it work/What should be fixed?**  
  Add custom validation to ensure that reservation dates are logical and within acceptable ranges.

---

## 5. **Insecure Error Messages**

- **What is wrong?**  
  Detailed error messages such as "Validation Error: Invalid email address" or "Invalid email or password" are returned to the user, potentially leaking information about system behavior.
- **How did you find it?**  
  By inspecting the `loginUser` and `registerUser` error handling logic.
- **How should it work/What should be fixed?**  
  Replace detailed error messages with generic responses like "Invalid credentials" or "An error occurred." Log detailed errors server-side instead.

---

## Phase 4

| Date      | Used hours | Subject(s)                                                | output                                                                           |
| --------- | ---------- | --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 7.12.2024 | 1          | Add the Privacy Policy,the terms of service, account page | I learned to implement authentication and manage legal policy pages effectively. |

### Answer to Questions

#### 1. Our system does not use consent (except for accepting the terms of service, but this is a slightly different matter). Is this good? Explain (100 words)

Not using consent extensively can simplify the user experience, especially in a system designed for specific functionalities like booking resources. However, this approach has drawbacks. Lack of explicit consent for data usage can lead to user distrust and potential legal issues, particularly in jurisdictions with stringent data protection laws (e.g., GDPR). Consent ensures users are aware of how their data is used, promoting transparency and accountability. While our system operates within a limited scope, adding consent mechanisms for actions like data collection, analytics, or email communications would align with best practices and foster user trust.

#### 2. Choose an example page where consent is required. Tell us which one you chose. Tell us why consent is required? (100 words)

I chose the "newsletter subscription" page as an example. Consent is required because subscribing to a newsletter involves collecting and processing a user's email address for sending periodic updates or promotional content. Under data protection regulations like GDPR, this constitutes personal data processing, which requires explicit user consent. Users must willingly opt-in to receive communications, and the system must ensure they understand how their data will be used, stored, and their rights to withdraw consent. This prevents unsolicited communication and aligns with legal and ethical standards for data handling.
