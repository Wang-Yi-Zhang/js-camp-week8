// ========================================
// 產品服務
// ========================================

const { fetchProducts } = require('../api');
const { getDiscountRate, getAllCategories, formatCurrency } = require('../utils');

/**
 * 取得所有產品
 * @returns {Promise<Object>}
 */
async function getProducts() {
  try {
    const products = await fetchProducts();
    // 防呆：確保回傳的一定是陣列
    const validProducts = Array.isArray(products) ? products : [];
    
    return {
      products: validProducts,
      count: validProducts.length
    };
  } catch (error) {
    console.error('取得產品列表失敗:', error.response?.data?.message || error.message);
    // 發生錯誤時回傳預設結構，避免呼叫端報錯
    return { products: [], count: 0 };
  }
}

/**
 * 根據分類篩選產品
 * @param {string} category - 分類名稱
 * @returns {Promise<Array>}
 */
async function getProductsByCategory(category) {
  try {
    const { products } = await getProducts();
    return products.filter(product => product.category === category);
  } catch (error) {
    console.error('篩選產品失敗:', error.response?.data?.message || error.message);
    return [];
  }
}

/**
 * 根據 ID 取得單一產品
 * @param {string} productId - 產品 ID
 * @returns {Promise<Object|null>}
 */
async function getProductById(productId) {
  try {
    const products = await fetchProducts();
    if (!Array.isArray(products)) return null;
    
    return products.find(product => product.id === productId) || null;
  } catch (error) {
    console.error('取得單一產品失敗:', error.response?.data?.message || error.message);
    return null;
  }
}

/**
 * 取得所有分類（不重複）
 * @returns {Promise<Array>}
 */
async function getCategories() {
  try {
    const products = await fetchProducts();
    if (!Array.isArray(products)) return [];
    
    return getAllCategories(products);
  } catch (error) {
    console.error('取得分類列表失敗:', error.response?.data?.message || error.message);
    return [];
  }
}

/**
 * 顯示產品列表
 * @param {Array} products - 產品陣列
 */
function displayProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    console.log('目前沒有產品');
    return;
  }

  console.log('產品列表：');
  console.log('----------------------------------------');
  
  products.forEach((product, index) => {
    // 賦予預設值，避免 API 資料缺漏
    const title = product.title || '未知產品';
    const category = product.category || '未分類';
    const originPrice = product.origin_price || 0;
    const price = product.price || 0;
    
    // 計算折扣
    const discountRate = getDiscountRate(product);
    // 如果沒有折扣（或等於原價），就不顯示括號
    const discountText = discountRate && discountRate !== '原價' ? ` (${discountRate})` : '';

    console.log(`${index + 1}. ${title}`);
    console.log(`    分類：${category}`);
    console.log(`    原價：${formatCurrency(originPrice)}`);
    console.log(`    售價：${formatCurrency(price)}${discountText}`);
    console.log('----------------------------------------');
  });
}

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductById,
  getCategories,
  displayProducts
};
