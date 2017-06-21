LINE BOT 電影查詢

可查詢本周新片、本期首輪、本期二輪、近期上映及各地戲院上映之電影清單


line_template.js

    產生 Carousel 及 Button 元件
    
    Set_Carousel 給予 Title、Text以及資料陣列
    就會回傳一個JSON
    
    之後在用 JSON.parse 處理之後再以 event.reply 回傳即可
    
    Set_Carousel_url 用法同 Set_Carousel
    但須在多給予 URI 陣列
    
    Button 目前是寫死的，只能產生固定格式的按鈕
    
sql.js

    用來設定及查詢使用者狀態以及取得相關資訊
    
parser.js
    
    取得網頁資料
    不過因為有些資料格式長得跟其他資料格式不同
    故有些資訊可能無法取得
    這個部分尚未處理

搜尋某些影城或影片可能會沒有回應你
那這可能是因為那個關鍵字搜尋不到任何結果
至於這問題我也無法，因為我是透過他的網站去爬資料的
使用該網站搜尋出來的結果再去搜尋一次是不一定會找到結果的
