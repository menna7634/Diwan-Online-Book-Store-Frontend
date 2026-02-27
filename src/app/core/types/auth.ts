
export interface RegisterationRequestBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  dob: Date;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }
}
export interface UpdateProfileRequestBody {
  firstname?: string;
  lastname?: string;
  dob?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  }
}
