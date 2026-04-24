// ========================================
// 購物車服務
// ========================================

const { fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart } = require('../api');
const { validateCartQuantity, formatCurrency } = require('../utils');

/**
 * 取得購物車
 * @returns {Promise<Object>}
 */
async function getCart() {
  try {
    const cartData = await fetchCart();
    return cartData;
  } catch (error) {
    console.error('取得購物車失敗:', error.response?.data?.message || error.message);
    throw error; 
  }
}

/**
 * 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>}
 */
async function addProductToCart(productId, quantity) {
  const validation = validateCartQuantity(quantity);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    const data = await addToCart(productId, quantity);
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>}
 */
async function updateProduct(cartId, quantity) {
  const validation = validateCartQuantity(quantity);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    const data = await updateCartItem(cartId, quantity);
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

/**
 * 移除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>}
 */
async function removeProduct(cartId) {
  try {
    const data = await deleteCartItem(cartId);
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

/**
 * 清空購物車
 * @returns {Promise<Object>}
 */
async function emptyCart() {
  try {
    const data = await clearCart();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

/**
 * 計算購物車總金額
 * @returns {Promise<Object>}
 */
async function getCartTotal() {
  try {
    const cartData = await fetchCart();
    return {
      total: cartData.total || 0,
      finalTotal: cartData.finalTotal || 0,
      itemCount: cartData.carts ? cartData.carts.length : 0
    };
  } catch (error) {
    console.error('取得購物車總計失敗:', error.response?.data?.message || error.message);
    // 發生錯誤時回傳預設值
    return { total: 0, finalTotal: 0, itemCount: 0 };
  }
}

/**
 * 顯示購物車內容
 * @param {Object} cart - 購物車資料
 */
function displayCart(cart) {
  if (!cart || !cart.carts || cart.carts.length === 0) {
    console.log('購物車是空的');
    return; // 提早結束函式
  }

  console.log('購物車內容：');
  console.log('----------------------------------------');
  
  // 迭代購物車陣列
  cart.carts.forEach((item, index) => {
    // 防呆處理，避免 API 回傳資料缺漏導致報錯
    const title = item.product?.title || '未知商品';
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    const subtotal = price * quantity; // 假設小計由前端計算，若 API 有提供也可直接使用 item.finalTotal

    console.log(`${index + 1}. ${title}`);
    console.log(`    數量：${quantity}`);
    console.log(`    單價：${formatCurrency(price)}`);
    console.log(`    小計：${formatCurrency(subtotal)}`);
  });

  console.log('----------------------------------------');
  console.log(`商品總計：${formatCurrency(cart.total || 0)}`);
  console.log(`折扣後金額：${formatCurrency(cart.finalTotal || 0)}`);
  // 請實作此函式
  // 提示：先判斷購物車是否為空（cart.carts 不存在或長度為 0），若空則輸出「購物車是空的」
  // 會使用到 utils formatCurrency() 來格式化金額
  //
  // 預期輸出格式：
  // 購物車內容：
  // ----------------------------------------
  // 1. 產品名稱
  //    數量：2
  //    單價：NT$ 800
  //    小計：NT$ 1,600
  // ----------------------------------------
  // 商品總計：NT$ 1,600
  // 折扣後金額：NT$ 1,600
}

module.exports = {
  getCart,
  addProductToCart,
  updateProduct,
  removeProduct,
  emptyCart,
  getCartTotal,
  displayCart
};
