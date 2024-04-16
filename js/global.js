(()=>{
    'use strict';

    // キーボードイベントリスナーを設定
    document.addEventListener('keydown', (e)=> {
        const url = window.location.href;
        // ポータル
        const isPortal = url.includes('/k/#/portal');
        // スペース
        const isSpace = url.includes('/k/#/space');
        // 検索結果
        const isSearch = url.includes('/k/search');

        // kintone.event.onでは検索結果画面を表示したイベントを検知できないためURLで判別する
        if (isPortal || isSpace || isSearch){
            if (e.key === '/') {
                var activeElement = document.activeElement;
                var isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
                // 入力フォームにフォーカスがない場合のみ処理
                if (!isInputFocused) {
                    var searchBox = document.querySelector('input[aria-controls="search-result-popup"]');
                    if (searchBox) {
                        // キーイベントのデフォルトの動作を防ぐ
                        e.preventDefault();
                        // 検索窓にフォーカス
                        searchBox.focus();
                    }
                }
            }
        }
    });

})();