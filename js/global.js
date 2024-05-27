(()=>{
    'use strict';

    /** ポータル */
    const URL_PORTAL = '/k/#/portal';
    /** スペース */
    const URL_SPACE = '/k/#/space';
    /** 検索 */
    const URL_SEARCH = '/k/search';
    /** 通知 */
    const URL_NOTIFICATION = '/k/#/ntf';
    /** 追加 */
    const URL_EDIT = '/edit'
    /** 編集 */
    const URL_MODE_EDIT = 'mode=edit'
    /** 詳細、編集 */
    const URL_SHOW = '/show'

    /** キーボードショートカットイベント */
    const keyboardShortcutEvents = [];
    // キー入力を追跡する変数
    const lastKeyPressed = [];

    /**
    * キーボードショートカットイベントを追加する
    * @param {Array} keys キー（最大2文字まで対応）
    * @param {Function} func 実行する処理
    * @param {Array} url ショートカットを有効化する画面URL（省略した場合は全画面有効）
    * @param {Array} disableUrl 明示的に無効化する画面URL
    */
    const addKeyboardShortcutEvent = (keys, func, url=[],disableUrl=[]) => {
        keyboardShortcutEvents.push({ keys: keys, func: func, url: url, disableUrl: disableUrl });
    };
    
    /**
    * 入力を受け取る
    * @param {string} key 入力キー
    * @param {Event} e イベント
    */
    const inputKey = (key, e) => {
        if (key == 'Shift')return;
        const url = window.location.href;
        // 最新のキーを記録
        lastKeyPressed.push(key);
        // 最大2文字を保持
        if (lastKeyPressed.length > 2) lastKeyPressed.shift();

        let allMatchedEvent = null;
        let lastMatchedEvent = null;
        keyboardShortcutEvents.forEach(event => {
            if ((event.url.length === 0 || event.url.some(u => url.includes(u))) &&
                event.disableUrl.every(u=> !url.includes(u))) {
                if (lastKeyPressed.join('') == event.keys.join('')){
                    allMatchedEvent = event;
                    lastKeyPressed.length = 0;
                    return;
                }else if(event.keys.length == 1 && lastKeyPressed[lastKeyPressed.length - 1] === event.keys[0]){
                    lastMatchedEvent = event;
                }
            }
        });
        let machedEvent = allMatchedEvent ?? lastMatchedEvent;
        if (machedEvent !== null){
            // キーイベントのデフォルトの動作を防ぐ
            e.preventDefault();
            // 登録された関数を実行
            machedEvent.func(key,e);
        }
    };

    // キーボードイベントリスナーを設定
    document.addEventListener('keydown', (e)=> {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.getAttribute('role') === 'textbox';
        // 入力フォームにフォーカスがない場合のみ処理
        if (!isInputFocused) inputKey(e.key,e);
    });

    // ▼ キーボードショートカットの登録 ▼
    // 「/」
    addKeyboardShortcutEvent(['/'],(key,e)=>{
        // 検索窓にフォーカス
        const searchBox = document.querySelector('input[aria-controls="search-result-popup"]');
        if (searchBox) searchBox.focus();
    },[URL_PORTAL,URL_SPACE,URL_SEARCH,URL_NOTIFICATION]);
    // 「h」
    addKeyboardShortcutEvent(['h'],(key,e)=>{
        // ポータル画面に遷移
        const navHome = document.querySelector(`a[href="${URL_PORTAL}"]`);
        if (navHome) navHome.click();
    },[],[URL_MODE_EDIT,URL_EDIT]);
    // 「t」
    addKeyboardShortcutEvent(['t'],(key,e)=>{
        // 通知画面に遷移
        const navNtf = document.querySelector(`a[href="${URL_NOTIFICATION}/mention"]`);
        if (navNtf) navNtf.click();
    },[],[URL_MODE_EDIT,URL_EDIT]);
    //  「y」
    addKeyboardShortcutEvent(['y'],(key,e)=>{
        // タブ移動（左）
        const customineTabButtons = document.getElementsByClassName('customine-tab-button');
        if (customineTabButtons){
            const buttonsArray = Array.from(customineTabButtons);
            const activeButton = document.querySelector('.customine-tab-button.active');
            const activeIndex = buttonsArray.indexOf(activeButton);
            const previousButton = activeIndex > 0 ? buttonsArray[activeIndex - 1] : null;
            if (previousButton) previousButton.click();
        }
    },[URL_SHOW,URL_EDIT]);
    //  「u」
    addKeyboardShortcutEvent(['u'],(key,e)=>{
        // タブ移動（右）
        const customineTabButtons = document.getElementsByClassName('customine-tab-button');
        if (customineTabButtons){
            const buttonsArray = Array.from(customineTabButtons);
            const activeButton = document.querySelector('.customine-tab-button.active');
            const activeIndex = buttonsArray.indexOf(activeButton);
            const nextButton = activeIndex < buttonsArray.length - 1 ? buttonsArray[activeIndex + 1] : null;
            if (nextButton) nextButton.click();
        }
    },[URL_SHOW,URL_EDIT]);
})();