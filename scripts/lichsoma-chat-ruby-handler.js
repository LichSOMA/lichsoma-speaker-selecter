/**
 * LichSOMA Chat Ruby Handler
 * 채팅 메시지에서 루비 문자(후리가나) 처리
 */

export class ChatRubyHandler {
    /**
     * 초기화
     */
    static initialize() {
        // 채팅 메시지 렌더링 시 루비 문자 처리
        Hooks.on('renderChatMessageHTML', (message, html, data) => {
            try {
                // html이 HTMLElement이므로 jQuery로 변환
                const $html = $(html);
                
                // 메시지 내용에서 루비 문자 처리
                const messageContent = $html.find('.message-content');
                if (messageContent.length) {
                    this.processRubyText(messageContent[0]);
                }
                
                // 헤더(발신자 이름)에서도 루비 문자 처리
                const messageSender = $html.find('.message-sender[data-lichsoma-sender="true"]').length
                    ? $html.find('.message-sender[data-lichsoma-sender="true"]')
                    : $html.find('.message-sender');
                if (messageSender.length) {
                    this.processRubyText(messageSender[0]);
                }
            } catch (e) {
                // 루비 문자 처리 중 오류 (무시)
            }
        });
    }
    
    /**
     * 루비 문자 처리: [[본문|루비]] -> <ruby>본문<rt>루비</rt></ruby>
     * @param {HTMLElement} element - 처리할 요소
     */
    static processRubyText(element) {
        if (!element) return;
        
        // 이미 처리된 요소는 건너뛰기 (중복 처리 방지)
        if (element.dataset.lichsomaRubyProcessed) return;
        
        try {
            // [[본문|루비]] 패턴을 찾아서 루비 태그로 변환
            // 패턴: [[로 시작, |로 구분, ]]로 끝
            const rubyPattern = /\[\[([^\|\]]+?)\|([^\]]+?)\]\]/g;
            
            // innerHTML을 직접 처리
            if (element.innerHTML) {
                element.innerHTML = element.innerHTML.replace(
                    rubyPattern,
                    '<ruby class="lichsoma-ruby">$1<rt>$2</rt></ruby>'
                );
            }
            
            // 처리 완료 표시
            element.dataset.lichsomaRubyProcessed = 'true';
        } catch (e) {
            // 루비 문자 변환 중 오류 (무시)
        }
    }
}

