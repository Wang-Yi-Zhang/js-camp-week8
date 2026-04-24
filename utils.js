// ========================================
// 工具函式
// ========================================

const dayjs = require('dayjs');

/**
 * 計算產品折扣率
 * @param {Object} product - 產品物件
 * @returns {string} - 例如 '8折'
 */
function getDiscountRate(product) {
  return `${Math.round((product.price / product.origin_price) * 10)}折`;
}

/**
 * 取得所有產品分類（不重複）
 * @param {Array} products - 產品陣列
 * @returns {Array} - 分類陣列
 */
function getAllCategories(products) {
  return [...new Set(products.map(product => product.category))];
}

/**
 * 格式化日期
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 格式 'YYYY/MM/DD HH:mm'，例如 '2024/01/01 08:00'
 */
function formatDate(timestamp) {
  return dayjs.unix(timestamp).format('YYYY/MM/DD HH:mm');
}

/**
 * 計算距今天數
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 例如 '3 天前'
 */
function getDaysAgo(timestamp) {
  const today = dayjs().startOf('day');
  const orderDate = dayjs.unix(timestamp).startOf('day');
  const diffDays = today.diff(orderDate, 'day');

  if (diffDays === 0) return '今天';
  if (diffDays < 0) return '未來日期';
  return `${diffDays} 天前`;
}

/**
 * 驗證訂單使用者資料
 * @param {Object} data - 使用者資料
 * @returns {Object} - { isValid: boolean, errors: string[] }
 * 
 * 驗證規則：
 * - name: 不可為空
 * - tel: 必須是 09 開頭的 10 位數字
 * - email: 必須包含 @ 符號
 * - address: 不可為空
 * - payment: 必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一
 */
function validateOrderUser(data) {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('姓名不可為空');
  }

  const telRegex = /^09\d{8}$/;
  if (!data.tel || !telRegex.test(data.tel)) {
    errors.push('電話格式錯誤，必須是 09 開頭的 10 位數字');
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Email 格式錯誤，必須包含 @ 符號');
  }
  
  if (!data.address || data.address.trim() === '') {
    errors.push('地址不可為空');
  }
  
  const validPayments = ['ATM', 'Credit Card', 'Apple Pay'];
  if (!data.payment || !validPayments.includes(data.payment)) {
    errors.push('付款方式不支援');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * 驗證購物車數量
 * @param {number} quantity - 數量
 * @returns {Object} - { isValid: boolean, error?: string }
 * 
 * 驗證規則：
 * - 必須是正整數
 * - 不可小於 1
 * - 不可大於 99
 */
function validateCartQuantity(quantity) {
  if (!Number.isInteger(quantity)) {
    return { isValid: false, error: '數量必須是整數' };
  }
  if (quantity < 1) {
    return { isValid: false, error: '數量不可小於 1' };
  }
  if (quantity > 99) {
    return { isValid: false, error: '數量不可大於 99' };
  }

  return { isValid: true };
}

/**
 * 格式化金額
 * @param {number} amount - 金額
 * @returns {string} - 格式化後的金額
 * 
 * 格式化規則：
 * - 加上 "NT$ " 前綴
 * - 數字需要千分位逗號分隔（例如：1000 → 1,000）
 * - 使用台灣格式（zh-TW）
 * 
 * 範例：
 * formatCurrency(1000) → "NT$ 1,000"
 * formatCurrency(1234567) → "NT$ 1,234,567"
 * 
 */
function formatCurrency(amount) {
  return `NT$ ${Number(amount).toLocaleString('zh-TW')}`;
}

module.exports = {
  getDiscountRate,
  getAllCategories,
  formatDate,
  getDaysAgo,
  validateOrderUser,
  validateCartQuantity,
  formatCurrency
};
