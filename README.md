## Installation

To install the application, run the following command in your terminal:

```bash
cd front-end && npm install && cd ../back-end && npm install && npx prisma generate && npx prisma migrate dev --name init && npx ts-node util/seed.ts
```

To run the application use the following commands in separate terminal windows:

```bash
cd back-end && npm start
cd front-end && npm start
```
