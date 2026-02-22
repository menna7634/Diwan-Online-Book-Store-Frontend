
export interface User {
  email: string;
  firstname: string;
  lastname: string;
  dob: Date;
  role: "admin" | "user";
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}
