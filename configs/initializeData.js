import Account from "../src/accounts/account.model.js";
import Customer from "../src/customers/customer.model.js";
const initializeData = async () => {
  try {
    const adminExists = await Customer.findOne({ username: "ADMINB" });

    if (!adminExists) {
      const newAdmin = new Customer({
        name: "Admin User",
        username: "ADMINB",
        gov_id: "ADMIN123456",
        address: {
          street: "Admin Street",
          city: "Admin City",
          state: "Admin State",
          zip: "12345",
        },
        cell_phone: "000-000-0000",
        email_address: "admin@example.com",
        password: "ADMINB",
        work_name: "Administrator",
        monthly_income: 1000,
        role: "admin",
      });

      await newAdmin.save();

      const newAccount = new Account({
        customer_id: newAdmin._id,
        account_no: newAdmin.account_no,
      });

      await newAccount.save();

      console.log("Default admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error initializing data", error);
  }
};

export default initializeData;
