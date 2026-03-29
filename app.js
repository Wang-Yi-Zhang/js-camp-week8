// ========================================
// 第八週期末專案：電商系統整合
// 執行方式：node app.js
// ========================================

const productService = require('./services/productService');
const cartService = require('./services/cartService');
const orderService = require('./services/orderService');
const { formatCurrency } = require('./utils');

// ========================================
// 主程式
// ========================================


async function main() {
  console.log('========================================');
  console.log('   電商系統 CLI 應用程式');
  console.log('========================================\n');

  try {
    // 1. 取得並顯示產品列表
    console.log('--- 步驟 1：取得產品列表 ---');
    const result = await productService.getProducts();
    console.log(`成功取得 ${result.products.length} 筆產品\n`);
    productService.displayProducts(result.products.slice(0, 3)); // 只顯示前 3 筆

    // 2. 取得產品分類
    console.log('\n--- 步驟 2：取得產品分類 ---');
    const categories = await productService.getCategories();
    console.log('分類：', categories.join(', '));

    // 3. 根據分類篩選
    console.log('\n--- 步驟 3：篩選特定分類 ---');
    if (categories.length > 0) {
      const filtered = await productService.getProductsByCategory(categories[0]);
      console.log(`「${categories[0]}」分類有 ${filtered.length} 筆產品`);
    }

    // 4. 查看購物車
    console.log('\n--- 步驟 4：查看購物車 ---');
    const cart = await cartService.getCart();
    cartService.displayCart(cart);

    // 5. 加入商品到購物車
    console.log('\n--- 步驟 5：加入商品到購物車 ---');
    if (result.products.length > 0) {
      const firstProduct = result.products[0];
      console.log(`嘗試加入商品：${firstProduct.title}`);
      const addResult = await cartService.addProductToCart(firstProduct.id, 1);
      if (addResult.success) {
        console.log('加入成功！');
      } else {
        console.log('加入失敗：', addResult.error);
      }
    }

    // 6. 再次查看購物車
    console.log('\n--- 步驟 6：更新後的購物車 ---');
    const updatedCart = await cartService.getCart();
    cartService.displayCart(updatedCart);

    // 7. 計算購物車總金額
    console.log('\n--- 步驟 7：購物車總金額 ---');
    const total = await cartService.getCartTotal();
    console.log(`商品數量：${total.itemCount}`);
    console.log(`總金額：${formatCurrency(total.total)}`);
    console.log(`折扣後：${formatCurrency(total.finalTotal)}`);

    // 8. 查看訂單列表（管理員功能）
    console.log('\n--- 步驟 8：訂單列表（管理員）---');
    const orders = await orderService.getOrders();
    console.log(`共有 ${orders.length} 筆訂單`);
    if (orders.length > 0) {
      orderService.displayOrders(orders.slice(0, 2)); // 只顯示前 2 筆
    }

    // 9. 篩選未付款訂單
    console.log('\n--- 步驟 9：未付款訂單 ---');
    const unpaidOrders = await orderService.getUnpaidOrders();
    console.log(`未付款訂單：${unpaidOrders.length} 筆`);

    // 10. 篩選已付款訂單
    console.log('\n--- 步驟 10：已付款訂單 ---');
    const paidOrders = await orderService.getPaidOrders();
    console.log(`已付款訂單：${paidOrders.length} 筆`);

    console.log('\n========================================');
    console.log('   程式執行完成');
    console.log('========================================');

  } catch (error) {
    console.error('程式執行錯誤：', error.message);
  }
}

// 執行主程式
main();
