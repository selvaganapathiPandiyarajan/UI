#  S'Track Financial Dashboard

An interactive, user-friendly Angular application for managing investments, tracking expenses, and visualizing financial performance. Built for personal or small business use.

---

##  Features

-  Login and Signup with validations
-  Wallet detail card with CVV, expiry, and balance
-  Bar & Line Charts (Chart.js)
-  FullCalendar integration for transaction views
-  Asset tracking: Stocks, Bonds, Real Estate, Cash
- Add, View, Filter & Paginate financial entries
-  Export data to PDF
-  Secure Password Reset

---

##  Tech Stack

| Technology     | Purpose                          |
|----------------|----------------------------------|
| Angular        | Frontend framework               |
| Chart.js       | Bar and Line charts              |
| FullCalendar   | Expense calendar view            |
| Bootstrap      | Styling and responsive layout    |
| json-server    | Mock backend (REST API)          |
| TypeScript     | Application logic                |

---

```bash
src/
├── app/
│   ├── nav/              # Navbar component
│   ├── chart-card/       # Chart rendering with filters
│   ├── asset-card/       # Reusable cards for assets like Wallet, Expense, etc.
│   ├── login/            # Login view and logic
│   ├── signup/           # Signup view and logic
│   ├── reset/            # Password reset component
│   ├── customer-dashboard/ # Main dashboard
│   ├── Controller/api.service.ts    # API interaction service
│   ├── model/user-details.model.ts # User model