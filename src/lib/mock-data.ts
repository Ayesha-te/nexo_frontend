// Mock data store for NexoKart

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePic: string;
  referralEmail: string;
  position: "left" | "right";
  paymentMethod: "easypaisa" | "jazzcash";
  isActive: boolean;
  leftTeam: number;
  rightTeam: number;
  currentIncome: number;
  rewardIncome: number;
  totalWithdraw: number;
  joinedAt: string;
}

export interface PinToken {
  id: string;
  token: string;
  status: "available" | "used" | "pending";
  purchasedAt: string;
  usedBy?: string;
  amount: number;
}

export interface PinRequest {
  id: string;
  userId: string;
  userName: string;
  accountNumber: string;
  trxId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  tax: number;
  taxType: "normal" | "cap" | "reward";
  netAmount: number;
  date: string;
  status: "processed" | "pending";
}

export interface TreeNode {
  id: string;
  name: string;
  position: "left" | "right" | "root";
  children: { left?: TreeNode; right?: TreeNode };
}

export const mockUser: User = {
  id: "u1",
  firstName: "Ahmed",
  lastName: "Khan",
  email: "ahmed@nexokart.com",
  phone: "03001234567",
  profilePic: "",
  referralEmail: "admin@nexokart.com",
  position: "left",
  paymentMethod: "easypaisa",
  isActive: true,
  leftTeam: 45,
  rightTeam: 38,
  currentIncome: 16600,
  rewardIncome: 5000,
  totalWithdraw: 12500,
  joinedAt: "2025-01-15",
};

export const mockPins: PinToken[] = [
  { id: "p1", token: "NXK-8A3F-9D2E-4B7C", status: "available", purchasedAt: "2025-12-01", amount: 1000 },
  { id: "p2", token: "NXK-1C5G-7H2J-6K9L", status: "used", purchasedAt: "2025-11-20", usedBy: "ali@test.com", amount: 1000 },
  { id: "p3", token: "NXK-4M8N-2P6Q-3R5S", status: "available", purchasedAt: "2025-12-05", amount: 1000 },
  { id: "p4", token: "NXK-7T1U-5V9W-8X2Y", status: "pending", purchasedAt: "2025-12-10", amount: 1000 },
];

export const mockPinRequests: PinRequest[] = [
  { id: "pr1", userId: "u1", userName: "Ahmed Khan", accountNumber: "03001234567", trxId: "TRX123456", amount: 2000, status: "pending", requestedAt: "2025-12-10" },
  { id: "pr2", userId: "u2", userName: "Ali Raza", accountNumber: "03119876543", trxId: "TRX789012", amount: 1000, status: "approved", requestedAt: "2025-12-08" },
  { id: "pr3", userId: "u3", userName: "Sara Ahmed", accountNumber: "03217654321", trxId: "TRX345678", amount: 3000, status: "rejected", requestedAt: "2025-12-07" },
  { id: "pr4", userId: "u4", userName: "Usman Malik", accountNumber: "03451112233", trxId: "TRX901234", amount: 1000, status: "pending", requestedAt: "2025-12-11" },
];

export const mockWithdrawals: Withdrawal[] = [
  { id: "w1", userId: "u1", userName: "Ahmed Khan", amount: 800, tax: 40, taxType: "normal", netAmount: 760, date: "2025-12-10", status: "processed" },
  { id: "w2", userId: "u1", userName: "Ahmed Khan", amount: 400, tax: 20, taxType: "normal", netAmount: 380, date: "2025-12-09", status: "processed" },
  { id: "w3", userId: "u1", userName: "Ahmed Khan", amount: 4000, tax: 400, taxType: "cap", netAmount: 3600, date: "2025-12-08", status: "processed" },
  { id: "w4", userId: "u1", userName: "Ahmed Khan", amount: 5000, tax: 500, taxType: "reward", netAmount: 4500, date: "2025-12-07", status: "processed" },
  { id: "w5", userId: "u1", userName: "Ahmed Khan", amount: 600, tax: 30, taxType: "normal", netAmount: 570, date: "2025-12-06", status: "processed" },
];

export const mockAllUsers: User[] = [
  mockUser,
  { id: "u2", firstName: "Ali", lastName: "Raza", email: "ali@test.com", phone: "03119876543", profilePic: "", referralEmail: "ahmed@nexokart.com", position: "left", paymentMethod: "easypaisa", isActive: true, leftTeam: 12, rightTeam: 10, currentIncome: 4400, rewardIncome: 0, totalWithdraw: 2000, joinedAt: "2025-02-10" },
  { id: "u3", firstName: "Sara", lastName: "Ahmed", email: "sara@test.com", phone: "03217654321", profilePic: "", referralEmail: "ahmed@nexokart.com", position: "right", paymentMethod: "jazzcash", isActive: true, leftTeam: 8, rightTeam: 5, currentIncome: 2600, rewardIncome: 0, totalWithdraw: 1000, joinedAt: "2025-03-05" },
  { id: "u4", firstName: "Usman", lastName: "Malik", email: "usman@test.com", phone: "03451112233", profilePic: "", referralEmail: "ali@test.com", position: "left", paymentMethod: "easypaisa", isActive: false, leftTeam: 3, rightTeam: 2, currentIncome: 1000, rewardIncome: 0, totalWithdraw: 500, joinedAt: "2025-04-20" },
  { id: "u5", firstName: "Fatima", lastName: "Noor", email: "fatima@test.com", phone: "03331234567", profilePic: "", referralEmail: "sara@test.com", position: "right", paymentMethod: "jazzcash", isActive: true, leftTeam: 5, rightTeam: 4, currentIncome: 1800, rewardIncome: 0, totalWithdraw: 800, joinedAt: "2025-05-15" },
];

export const mockTree: TreeNode = {
  id: "u1",
  name: "Ahmed Khan",
  position: "root",
  children: {
    left: {
      id: "u2",
      name: "Ali Raza",
      position: "left",
      children: {
        left: { id: "u4", name: "Usman Malik", position: "left", children: {} },
        right: { id: "u6", name: "Hamza Ali", position: "right", children: {} },
      },
    },
    right: {
      id: "u3",
      name: "Sara Ahmed",
      position: "right",
      children: {
        left: { id: "u5", name: "Fatima Noor", position: "left", children: {} },
        right: { id: "u7", name: "Zainab Raza", position: "right", children: {} },
      },
    },
  },
};

export const rewardsTable = [
  { level: 1, left: 20, right: 20, reward: "Certificate" },
  { level: 2, left: 50, right: 50, reward: "Perfume Gifts 🎁" },
  { level: 3, left: 200, right: 200, reward: "PKR 5,000" },
  { level: 4, left: 750, right: 750, reward: "PKR 20,000" },
  { level: 5, left: 2000, right: 2000, reward: "PKR 75,000" },
  { level: 6, left: 5000, right: 5000, reward: "PKR 150,000" },
  { level: 7, left: 15000, right: 15000, reward: "PKR 500,000" },
  { level: 8, left: 25000, right: 25000, reward: "PKR 700,000" },
  { level: 9, left: 35000, right: 35000, reward: "PKR 1,000,000" },
  { level: 10, left: 50000, right: 50000, reward: "PKR 1,500,000" },
];
