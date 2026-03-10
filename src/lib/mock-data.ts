// Mock data store for Nexocart

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
  paymentMethod: "easypaisa" | "jazzcash" | "bank_account";
  accountNumber: string;
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
  email: string;
  position: "left" | "right" | "root";
  children: { left?: TreeNode; right?: TreeNode };
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  type: "feedback" | "complaint";
  submittedAt: string;
  status: "new" | "reviewed" | "resolved";
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
  { id: "w1", userId: "u1", userName: "Ahmed Khan", paymentMethod: "easypaisa", accountNumber: "03001234567", amount: 800, tax: 40, taxType: "normal", netAmount: 760, date: "2025-12-10", status: "processed" },
  { id: "w2", userId: "u1", userName: "Ahmed Khan", paymentMethod: "jazzcash", accountNumber: "03001234567", amount: 400, tax: 20, taxType: "normal", netAmount: 380, date: "2025-12-09", status: "processed" },
  { id: "w3", userId: "u1", userName: "Ahmed Khan", paymentMethod: "bank_account", accountNumber: "1450-223344-8899", amount: 4000, tax: 400, taxType: "cap", netAmount: 3600, date: "2025-12-08", status: "processed" },
  { id: "w4", userId: "u1", userName: "Ahmed Khan", paymentMethod: "bank_account", accountNumber: "1450-223344-8899", amount: 5000, tax: 500, taxType: "reward", netAmount: 4500, date: "2025-12-07", status: "processed" },
  { id: "w5", userId: "u1", userName: "Ahmed Khan", paymentMethod: "easypaisa", accountNumber: "03001234567", amount: 600, tax: 30, taxType: "normal", netAmount: 570, date: "2025-12-06", status: "processed" },
  { id: "w6", userId: "u2", userName: "Ali Raza", paymentMethod: "easypaisa", accountNumber: "03119876543", amount: 1000, tax: 50, taxType: "normal", netAmount: 950, date: "2025-12-10", status: "processed" },
  { id: "w7", userId: "u2", userName: "Ali Raza", paymentMethod: "jazzcash", accountNumber: "03119876543", amount: 500, tax: 25, taxType: "normal", netAmount: 475, date: "2025-12-09", status: "processed" },
  { id: "w8", userId: "u3", userName: "Sara Ahmed", paymentMethod: "jazzcash", accountNumber: "03217654321", amount: 1200, tax: 60, taxType: "normal", netAmount: 1140, date: "2025-12-09", status: "processed" },
  { id: "w9", userId: "u4", userName: "Usman Malik", paymentMethod: "bank_account", accountNumber: "1830-990011-7722", amount: 800, tax: 40, taxType: "normal", netAmount: 760, date: "2025-12-08", status: "processed" },
  { id: "w10", userId: "u5", userName: "Fatima Noor", paymentMethod: "easypaisa", accountNumber: "03331234567", amount: 1400, tax: 70, taxType: "normal", netAmount: 1330, date: "2025-12-07", status: "processed" },
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
  email: "ahmed@nexokart.com",
  position: "root",
  children: {
    left: {
      id: "u2",
      name: "Ali Raza",
      email: "ali@test.com",
      position: "left",
      children: {
        left: { id: "u4", name: "Usman Malik", email: "usman@test.com", position: "left", children: {} },
        right: { id: "u6", name: "Hamza Ali", email: "hamza@nexokart.com", position: "right", children: {} },
      },
    },
    right: {
      id: "u3",
      name: "Sara Ahmed",
      email: "sara@test.com",
      position: "right",
      children: {
        left: { id: "u5", name: "Fatima Noor", email: "fatima@test.com", position: "left", children: {} },
        right: { id: "u7", name: "Zainab Raza", email: "zainab@nexokart.com", position: "right", children: {} },
      },
    },
  },
};

export const findTreeNodeById = (node: TreeNode, nodeId: string): TreeNode | null => {
  if (node.id === nodeId) return node;
  if (node.children.left) {
    const foundLeft = findTreeNodeById(node.children.left, nodeId);
    if (foundLeft) return foundLeft;
  }
  if (node.children.right) {
    const foundRight = findTreeNodeById(node.children.right, nodeId);
    if (foundRight) return foundRight;
  }
  return null;
};

export const mockFeedback: Feedback[] = [
  { id: "fb1", name: "Ahmed Khan", email: "ahmed@nexokart.com", message: "Great platform! Very easy to use and navigate.", type: "feedback", submittedAt: "2025-12-10", status: "reviewed" },
  { id: "fb2", name: "Ali Raza", email: "ali@test.com", message: "Withdrawal process is too slow. Please speed it up.", type: "complaint", submittedAt: "2025-12-09", status: "new" },
  { id: "fb3", name: "Sara Ahmed", email: "sara@test.com", message: "Love the new design! Makes management easier.", type: "feedback", submittedAt: "2025-12-08", status: "reviewed" },
  { id: "fb4", name: "Usman Malik", email: "usman@test.com", message: "Having issues with pin activation. Need help.", type: "complaint", submittedAt: "2025-12-07", status: "resolved" },
  { id: "fb5", name: "Fatima Noor", email: "fatima@test.com", message: "The dashboard looks amazing. Keep up the good work!", type: "feedback", submittedAt: "2025-12-05", status: "reviewed" },
];

export const rewardsTable = [
  { level: 1, left: 20, right: 20, reward: "Experience Certificate 🏅" },
  { level: 2, left: 50, right: 50, reward: "Perfume Gift 🎁" },
  { level: 3, left: 100, right: 100, reward: "PKR 3,000" },
  { level: 4, left: 200, right: 200, reward: "PKR 5,000" },
  { level: 5, left: 500, right: 500, reward: "PKR 7,000" },
  { level: 6, left: 1000, right: 1000, reward: "PKR 10,000" },
  { level: 7, left: 2000, right: 2000, reward: "PKR 25,000" },
  { level: 8, left: 5000, right: 5000, reward: "PKR 50,000" },
  { level: 9, left: 7500, right: 7500, reward: "PKR 80,000" },
  { level: 10, left: 10000, right: 10000, reward: "PKR 120,000" },
  { level: 11, left: 12500, right: 12500, reward: "PKR 200,000" },
  { level: 12, left: 20000, right: 20000, reward: "PKR 400,000" },
  { level: 13, left: 30000, right: 30000, reward: "PKR 600,000" },
  { level: 14, left: 40000, right: 40000, reward: "PKR 900,000" },
  { level: 15, left: 50000, right: 50000, reward: "PKR 1,500,000" },
];
