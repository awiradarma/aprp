export type Language = 'en' | 'pt' | 'es' | 'fr' | 'ko' | 'id';

export const LANGUAGES: Record<Language, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇺🇸' },
    pt: { name: 'Português', flag: '🇧🇷' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
    ko: { name: '한국어', flag: '🇰🇷' },
    id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
};

const translations = {
    en: {
        appName: 'Anonymous Prayer Request',
        nav: { discover: '🌍 Discover', myPrayers: '📿 My Prayers', restoreSession: '🔑 Restore Session', privacyFaq: '🔒 Privacy & FAQ', newRequest: '+ New Request' },
        home: { subtitle: 'Share your prayer request anonymously with the world.', prayerLabel: 'Your Prayer Request', prayerPlaceholder: 'Lord, I pray for...', locationLabel: 'Your Location (Optional)', locationPlaceholder: 'e.g. Chicago, IL or Tokyo', locationPrivacy: 'Your exact location is never stored. We use privacy-preserving Geohashing.', submit: 'Submit Anonymously', anonNote: 'Your request is completely anonymous. An identity stub is securely attached to your session to manage your requests.' },
        prayer: { prayerRequest: 'Prayer Request', answeredPrayer: '🙌 Answered Prayer', prayed: '{n} Prayed', intercessors: '🌍 {n} Intercessor(s) from around the world', locationPlaceholder: 'Your location (optional) e.g. Lagos, Nigeria', locationPrivacyNote: '📍 Location is optional and privacy-preserving. Your exact coordinates are never stored.', iPrayed: '🙏 I Prayed', youPrayed: '✓ You Prayed For This', shareUrl: 'Share this URL', shareCopied: '✓ Copied to clipboard!', shareFailed: 'Could not share.', translateContent: '🌐 Translate this prayer', yourRequest: 'Your Request', editText: '✏️ Edit Prayer Text', saveChanges: 'Save Changes', cancel: 'Cancel', saving: 'Saving…', prayerUpdated: '✓ Prayer updated!', markAnswered: '✅ Mark as Answered', prayerAnswered: '🙌 This prayer was answered!' },
        discover: { title: 'Global Requests', subtitle: 'Prayers from around the world', joinPrayer: 'Join in Prayer →', loadMore: 'Load More Prayers', loading: 'Loading…', endOfFeed: "You've seen all {n} prayers. 🙏", noPrayers: 'No prayers yet', noPrayersSub: 'Be the first to submit a prayer request.', submitRequest: 'Submit a request →', praying: '{n} praying', justNow: 'just now', mAgo: '{n}m ago', hAgo: '{n}h ago', dAgo: '{n}d ago' },
        dashboard: { title: 'My Prayers', prayerKeyTitle: '🔑 Your Prayer Key', prayerKeyDesc: 'This is your only connection to your prayers — like a key to an anonymous journal. Save it somewhere safe. If you ever switch devices or clear your browser, enter this key to restore your prayers.', learnAnonymity: 'Learn how anonymity works →', yourRequests: 'Your Prayer Requests', requestsFollowed: 'Prayer Requests You Followed', noRequests: 'No prayer requests submitted yet.', noIntercessions: "You haven't interceded for any requests yet.", view: 'View', active: 'Active' },
        recover: { title: '🔑 Restore Your Session', subtitle: 'Enter your Prayer Key to pick up right where you left off — on any device.', prayerKey: 'Prayer Key', button: 'Recover My Profile', backHome: 'Back to Home', howAnonymity: 'How does anonymity work?' },
        faq: {
            title: 'Privacy & FAQ', subtitle: 'How anonymity works, what we store, and why you can trust this space.',
            questions: [
                { q: 'Is this truly anonymous?', a: 'Yes. We never ask for your name, email, or any personal information. When you first visit, your browser is assigned a random ID — that\'s it. Even we cannot tell who you are.' },
                { q: "Why can I see my prayers on 'My Prayers'?", a: "'My Prayers' works like a private notepad only your browser can open. No one — not us — can look up your prayers by name, location, or identity." },
                { q: 'What is a Prayer Key and why do I need it?', a: 'Your Prayer Key is your only connection to your prayers — like a key to an anonymous safe deposit box. Use it to restore access on a new device or after clearing your browser.' },
                { q: 'What personal data do you store?', a: 'Only: (1) your prayer text, (2) a random anonymous ID, and (3) optionally a rough geographic region — never your exact coordinates.' },
                { q: 'What happens to my location if I share it?', a: 'We slightly randomize coordinates (±1km) and convert them to a geographic grid cell. Your raw coordinates are never stored.' },
                { q: 'Can other people see who submitted a prayer?', a: 'No. Requests show no author information — only the text, rough region (if shared), and prayer count.' },
                { q: 'Can I modify my prayer after submitting it?', a: 'Yes. On your prayer page, you can edit the text or mark it as answered — only on the submitting device or after restoring your session.' },
                { q: 'What happens if I clear my browser?', a: 'Your prayers remain in the database and visible globally, but you lose management access on that device. Save your Prayer Key before clearing.' },
                { q: 'Who runs this?', a: 'A personal ministry project to connect believers in prayer across borders. No ads, no data sales, no monetization.' },
            ],
        },
    },
    pt: {
        appName: 'Pedido de Oração Anônimo',
        nav: { discover: '🌍 Descobrir', myPrayers: '📿 Minhas Orações', restoreSession: '🔑 Restaurar Sessão', privacyFaq: '🔒 Privacidade & FAQ', newRequest: '+ Novo Pedido' },
        home: { subtitle: 'Compartilhe seu pedido de oração anonimamente com o mundo.', prayerLabel: 'Seu Pedido de Oração', prayerPlaceholder: 'Senhor, eu oro por...', locationLabel: 'Sua Localização (Opcional)', locationPlaceholder: 'ex: São Paulo, SP ou Tóquio', locationPrivacy: 'Sua localização exata nunca é armazenada. Usamos Geohashing para preservar sua privacidade.', submit: 'Enviar Anonimamente', anonNote: 'Seu pedido é completamente anônimo. Uma identidade temporária é criada no dispositivo para gerenciar seus pedidos.' },
        prayer: { prayerRequest: 'Pedido de Oração', answeredPrayer: '🙌 Oração Respondida', prayed: '{n} Oraram', intercessors: '🌍 {n} Intercessor(es) ao redor do mundo', locationPlaceholder: 'Sua localização (opcional) ex: Lagos, Nigéria', locationPrivacyNote: '📍 A localização é opcional e preserva sua privacidade. Suas coordenadas exatas nunca são armazenadas.', iPrayed: '🙏 Eu Orei', youPrayed: '✓ Você Orou Por Isso', shareUrl: 'Compartilhar esta URL', shareCopied: '✓ Copiado!', shareFailed: 'Não foi possível compartilhar.', translateContent: '🌐 Traduzir esta oração', yourRequest: 'Seu Pedido', editText: '✏️ Editar Texto da Oração', saveChanges: 'Salvar Alterações', cancel: 'Cancelar', saving: 'Salvando…', prayerUpdated: '✓ Oração atualizada!', markAnswered: '✅ Marcar como Respondida', prayerAnswered: '🙌 Esta oração foi respondida!' },
        discover: { title: 'Pedidos Globais', subtitle: 'Orações de todo o mundo', joinPrayer: 'Juntar-se em Oração →', loadMore: 'Carregar Mais Orações', loading: 'Carregando…', endOfFeed: 'Você viu todas as {n} orações. 🙏', noPrayers: 'Nenhuma oração ainda', noPrayersSub: 'Seja o primeiro a enviar um pedido.', submitRequest: 'Enviar um pedido →', praying: '{n} orando', justNow: 'agora mesmo', mAgo: 'há {n}min', hAgo: 'há {n}h', dAgo: 'há {n}d' },
        dashboard: { title: 'Minhas Orações', prayerKeyTitle: '🔑 Sua Chave de Oração', prayerKeyDesc: 'Esta é sua única conexão com suas orações — como a chave de um diário anônimo. Guarde-a em lugar seguro.', learnAnonymity: 'Saiba como o anonimato funciona →', yourRequests: 'Seus Pedidos de Oração', requestsFollowed: 'Pedidos que Você Acompanhou', noRequests: 'Nenhum pedido enviado ainda.', noIntercessions: 'Você ainda não intercedeu por nenhum pedido.', view: 'Ver', active: 'Ativo' },
        recover: { title: '🔑 Restaurar Sua Sessão', subtitle: 'Insira sua Chave de Oração para continuar de onde parou — em qualquer dispositivo.', prayerKey: 'Chave de Oração', button: 'Recuperar Meu Perfil', backHome: 'Voltar ao Início', howAnonymity: 'Como o anonimato funciona?' },
        faq: {
            title: 'Privacidade & FAQ', subtitle: 'Como o anonimato funciona, o que armazenamos e por que você pode confiar neste espaço.',
            questions: [
                { q: 'Isso é verdadeiramente anônimo?', a: 'Sim. Nunca pedimos seu nome, e-mail ou qualquer informação pessoal. Seu navegador recebe um ID aleatório — só isso. Nem nós sabemos quem você é.' },
                { q: "Por que consigo ver minhas orações em 'Minhas Orações'?", a: "'Minhas Orações' funciona como um diário particular que só seu dispositivo pode abrir. Ninguém — nem nós — pode ver suas orações pelo seu nome ou identidade." },
                { q: 'O que é uma Chave de Oração e por que preciso dela?', a: 'É sua única conexão com suas orações — como a chave de um cofre anônimo. Use-a para acessar suas orações em um novo dispositivo ou após limpar o navegador.' },
                { q: 'Quais dados pessoais são armazenados?', a: 'Apenas: (1) o texto do seu pedido, (2) um ID anônimo aleatório, e (3) opcionalmente, uma região geográfica aproximada — nunca suas coordenadas exatas.' },
                { q: 'O que acontece com minha localização?', a: 'Randomizamos levemente as coordenadas (±1km) e as convertemos em uma célula de grade geográfica. Suas coordenadas brutas nunca são armazenadas.' },
                { q: 'Outras pessoas podem ver quem enviou o pedido?', a: 'Não. Os pedidos são exibidos sem qualquer informação de autoria.' },
                { q: 'Posso editar minha oração depois de enviá-la?', a: 'Sim. Na página da sua oração, você pode editar o texto ou marcar como respondida — apenas no dispositivo que a enviou.' },
                { q: 'O que acontece se eu limpar o navegador?', a: 'Seus pedidos permanecem no banco de dados, mas você perde o acesso para gerenciá-los naquele dispositivo. Salve sua Chave de Oração antes de limpar.' },
                { q: 'Quem mantém este serviço?', a: 'Um projeto ministerial pessoal para conectar crentes em oração além das fronteiras. Sem anúncios, sem venda de dados.' },
            ],
        },
    },
    es: {
        appName: 'Petición de Oración Anónima',
        nav: { discover: '🌍 Descubrir', myPrayers: '📿 Mis Oraciones', restoreSession: '🔑 Restaurar Sesión', privacyFaq: '🔒 Privacidad & FAQ', newRequest: '+ Nueva Petición' },
        home: { subtitle: 'Comparte tu petición de oración de forma anónima con el mundo.', prayerLabel: 'Tu Petición de Oración', prayerPlaceholder: 'Señor, oro por...', locationLabel: 'Tu Ubicación (Opcional)', locationPlaceholder: 'ej: Ciudad de México o Tokio', locationPrivacy: 'Tu ubicación exacta nunca se almacena. Usamos Geohashing para proteger tu privacidad.', submit: 'Enviar Anónimamente', anonNote: 'Tu petición es completamente anónima. Se crea una identidad temporal en tu dispositivo.' },
        prayer: { prayerRequest: 'Petición de Oración', answeredPrayer: '🙌 Oración Respondida', prayed: '{n} Oraron', intercessors: '🌍 {n} Intercesor(es) alrededor del mundo', locationPlaceholder: 'Tu ubicación (opcional) ej: Lagos, Nigeria', locationPrivacyNote: '📍 La ubicación es opcional y protege tu privacidad. Tus coordenadas exactas nunca se almacenan.', iPrayed: '🙏 Oré', youPrayed: '✓ Oraste Por Esto', shareUrl: 'Compartir esta URL', shareCopied: '✓ ¡Copiado al portapapeles!', shareFailed: 'No se pudo compartir.', translateContent: '🌐 Traducir esta oración', yourRequest: 'Tu Petición', editText: '✏️ Editar Texto de Oración', saveChanges: 'Guardar Cambios', cancel: 'Cancelar', saving: 'Guardando…', prayerUpdated: '✓ ¡Oración actualizada!', markAnswered: '✅ Marcar como Respondida', prayerAnswered: '🙌 ¡Esta oración fue respondida!' },
        discover: { title: 'Peticiones Globales', subtitle: 'Oraciones de todo el mundo', joinPrayer: 'Unirse en Oración →', loadMore: 'Cargar Más Oraciones', loading: 'Cargando…', endOfFeed: 'Has visto todas las {n} oraciones. 🙏', noPrayers: 'No hay oraciones aún', noPrayersSub: 'Sé el primero en enviar una petición de oración.', submitRequest: 'Enviar una petición →', praying: '{n} orando', justNow: 'ahora mismo', mAgo: 'hace {n}min', hAgo: 'hace {n}h', dAgo: 'hace {n}d' },
        dashboard: { title: 'Mis Oraciones', prayerKeyTitle: '🔑 Tu Clave de Oración', prayerKeyDesc: 'Esta es tu única conexión con tus oraciones — como la llave de un diario anónimo. Guárdala en un lugar seguro.', learnAnonymity: 'Aprende cómo funciona el anonimato →', yourRequests: 'Tus Peticiones de Oración', requestsFollowed: 'Peticiones que Seguiste', noRequests: 'No hay peticiones enviadas aún.', noIntercessions: 'Aún no has intercedido por ninguna petición.', view: 'Ver', active: 'Activo' },
        recover: { title: '🔑 Restaurar Tu Sesión', subtitle: 'Ingresa tu Clave de Oración para continuar donde lo dejaste — en cualquier dispositivo.', prayerKey: 'Clave de Oración', button: 'Recuperar Mi Perfil', backHome: 'Volver al Inicio', howAnonymity: '¿Cómo funciona el anonimato?' },
        faq: {
            title: 'Privacidad & FAQ', subtitle: 'Cómo funciona el anonimato, qué almacenamos y por qué puedes confiar en este espacio.',
            questions: [
                { q: '¿Es verdaderamente anónimo?', a: 'Sí. Nunca pedimos tu nombre, correo o información personal. Tu navegador recibe un ID aleatorio — eso es todo. Ni nosotros podemos saber quién eres.' },
                { q: "¿Por qué puedo ver mis oraciones en 'Mis Oraciones'?", a: "'Mis Oraciones' funciona como un diario privado que solo tu dispositivo puede abrir. Nadie puede buscar tus oraciones por tu nombre o identidad." },
                { q: '¿Qué es una Clave de Oración y por qué la necesito?', a: 'Es tu única conexión con tus oraciones — como la llave de una caja fuerte anónima. Úsala para acceder desde un nuevo dispositivo.' },
                { q: '¿Qué datos personales almacenan?', a: 'Solo: (1) el texto de tu petición, (2) un ID anónimo aleatorio, y (3) opcionalmente, una región geográfica aproximada — nunca tus coordenadas exactas.' },
                { q: '¿Qué pasa con mi ubicación si la comparto?', a: 'Aleatorizamos ligeramente las coordenadas (±1km) y las convertimos en una celda de cuadrícula geográfica. Tus coordenadas reales nunca se almacenan.' },
                { q: '¿Pueden otros ver quién envió la petición?', a: 'No. Las peticiones no muestran información del autor — solo el texto, la región aproximada y el conteo de oraciones.' },
                { q: '¿Puedo editar mi oración después de enviarla?', a: 'Sí. En la página de tu oración, puedes editar el texto o marcarla como respondida — solo desde el dispositivo que la envió.' },
                { q: '¿Qué pasa si limpio el navegador?', a: 'Tus peticiones permanecen en la base de datos, pero pierdes el acceso para gestionarlas en ese dispositivo. Guarda tu Clave de Oración antes de limpiar.' },
                { q: '¿Quién administra esto?', a: 'Un proyecto ministerial personal para conectar creyentes en oración más allá de las fronteras. Sin anuncios, sin venta de datos.' },
            ],
        },
    },
    fr: {
        appName: 'Demande de Prière Anonyme',
        nav: { discover: '🌍 Découvrir', myPrayers: '📿 Mes Prières', restoreSession: '🔑 Restaurer la Session', privacyFaq: '🔒 Confidentialité & FAQ', newRequest: '+ Nouvelle Demande' },
        home: { subtitle: 'Partagez votre demande de prière anonymement avec le monde.', prayerLabel: 'Votre Demande de Prière', prayerPlaceholder: 'Seigneur, je prie pour...', locationLabel: 'Votre Localisation (Optionnel)', locationPlaceholder: 'ex: Paris, France ou Tokyo', locationPrivacy: 'Votre localisation exacte n\'est jamais stockée. Nous utilisons le Geohashing pour protéger votre vie privée.', submit: 'Soumettre Anonymement', anonNote: 'Votre demande est totalement anonyme. Une identité temporaire est créée sur votre appareil.' },
        prayer: { prayerRequest: 'Demande de Prière', answeredPrayer: '🙌 Prière Exaucée', prayed: '{n} ont prié', intercessors: '🌍 {n} Intercesseur(s) du monde entier', locationPlaceholder: 'Votre localisation (optionnel) ex: Lagos, Nigéria', locationPrivacyNote: '📍 La localisation est optionnelle et protège votre vie privée. Vos coordonnées exactes ne sont jamais stockées.', iPrayed: '🙏 J\'ai Prié', youPrayed: '✓ Vous Avez Prié Pour Cela', shareUrl: 'Partager cette URL', shareCopied: '✓ Copié dans le presse-papiers !', shareFailed: 'Impossible de partager.', translateContent: '🌐 Traduire cette prière', yourRequest: 'Votre Demande', editText: '✏️ Modifier le Texte', saveChanges: 'Enregistrer', cancel: 'Annuler', saving: 'Enregistrement…', prayerUpdated: '✓ Prière mise à jour !', markAnswered: '✅ Marquer comme Exaucée', prayerAnswered: '🙌 Cette prière a été exaucée !' },
        discover: { title: 'Demandes Mondiales', subtitle: 'Prières du monde entier', joinPrayer: 'Joindre en Prière →', loadMore: 'Charger Plus de Prières', loading: 'Chargement…', endOfFeed: 'Vous avez vu toutes les {n} prières. 🙏', noPrayers: 'Aucune prière encore', noPrayersSub: 'Soyez le premier à soumettre une demande de prière.', submitRequest: 'Soumettre une demande →', praying: '{n} en prière', justNow: 'à l\'instant', mAgo: 'il y a {n}min', hAgo: 'il y a {n}h', dAgo: 'il y a {n}j' },
        dashboard: { title: 'Mes Prières', prayerKeyTitle: '🔑 Votre Clé de Prière', prayerKeyDesc: 'C\'est votre unique lien avec vos prières — comme la clé d\'un journal anonyme. Conservez-la en lieu sûr.', learnAnonymity: 'Comment fonctionne l\'anonymat →', yourRequests: 'Vos Demandes de Prière', requestsFollowed: 'Demandes que Vous Avez Suivies', noRequests: 'Aucune demande soumise pour l\'instant.', noIntercessions: 'Vous n\'avez encore intercédé pour aucune demande.', view: 'Voir', active: 'Actif' },
        recover: { title: '🔑 Restaurer Votre Session', subtitle: 'Entrez votre Clé de Prière pour reprendre là où vous étiez — sur n\'importe quel appareil.', prayerKey: 'Clé de Prière', button: 'Récupérer Mon Profil', backHome: 'Retour à l\'accueil', howAnonymity: 'Comment fonctionne l\'anonymat ?' },
        faq: {
            title: 'Confidentialité & FAQ', subtitle: 'Comment fonctionne l\'anonymat, ce que nous stockons et pourquoi vous pouvez faire confiance à cet espace.',
            questions: [
                { q: 'Est-ce vraiment anonyme ?', a: 'Oui. Nous ne demandons jamais votre nom, e-mail ou toute information personnelle. Votre navigateur reçoit un ID aléatoire — c\'est tout. Même nous ne pouvons pas savoir qui vous êtes.' },
                { q: "Pourquoi puis-je voir mes prières dans 'Mes Prières' ?", a: "'Mes Prières' fonctionne comme un journal privé que seul votre appareil peut ouvrir. Personne ne peut accéder à vos prières par votre nom ou identité." },
                { q: 'Qu\'est-ce qu\'une Clé de Prière ?', a: 'C\'est votre seul lien avec vos prières — comme la clé d\'un coffre-fort anonyme. Utilisez-la pour accéder à vos prières depuis un nouvel appareil.' },
                { q: 'Quelles données personnelles stockez-vous ?', a: 'Seulement : (1) le texte de votre demande, (2) un ID anonyme aléatoire, et (3) optionnellement, une région géographique approximative — jamais vos coordonnées exactes.' },
                { q: 'Que se passe-t-il avec ma localisation ?', a: 'Nous randomisons légèrement les coordonnées (±1km) et les convertissons en une cellule de grille géographique. Vos coordonnées brutes ne sont jamais stockées.' },
                { q: 'Les autres peuvent-ils voir qui a soumis une demande ?', a: 'Non. Les demandes n\'affichent aucune information sur l\'auteur — seulement le texte, la région approximative et le nombre de prières.' },
                { q: 'Puis-je modifier ma prière après l\'avoir soumise ?', a: 'Oui. Sur la page de votre prière, vous pouvez modifier le texte ou la marquer comme exaucée — uniquement depuis l\'appareil qui l\'a soumise.' },
                { q: 'Que se passe-t-il si je vide mon navigateur ?', a: 'Vos demandes restent dans la base de données, mais vous perdez l\'accès pour les gérer sur cet appareil. Conservez votre Clé de Prière avant de vider.' },
                { q: 'Qui gère ce service ?', a: 'Un projet ministériel personnel pour connecter les croyants en prière au-delà des frontières. Sans publicité, sans vente de données.' },
            ],
        },
    },
    ko: {
        appName: '익명 기도 요청',
        nav: { discover: '🌍 발견', myPrayers: '📿 내 기도', restoreSession: '🔑 세션 복원', privacyFaq: '🔒 개인정보 & FAQ', newRequest: '+ 새 요청' },
        home: { subtitle: '전 세계와 익명으로 기도 요청을 나누세요.', prayerLabel: '기도 요청', prayerPlaceholder: '주님, 저는 기도합니다...', locationLabel: '위치 (선택사항)', locationPlaceholder: '예: 서울, 한국 또는 도쿄', locationPrivacy: '정확한 위치는 절대 저장되지 않습니다. 개인정보를 보호하는 Geohashing을 사용합니다.', submit: '익명으로 제출', anonNote: '요청은 완전히 익명입니다. 임시 식별자가 기기에 생성되어 요청을 관리합니다.' },
        prayer: { prayerRequest: '기도 요청', answeredPrayer: '🙌 응답된 기도', prayed: '{n}명이 기도함', intercessors: '🌍 전 세계 {n}명의 중보기도자', locationPlaceholder: '위치 (선택사항) 예: 서울, 한국', locationPrivacyNote: '📍 위치는 선택사항이며 개인정보를 보호합니다. 정확한 좌표는 절대 저장되지 않습니다.', iPrayed: '🙏 기도했습니다', youPrayed: '✓ 이 기도를 위해 기도하셨습니다', shareUrl: '이 URL 공유', shareCopied: '✓ 클립보드에 복사됨!', shareFailed: '공유할 수 없습니다.', translateContent: '🌐 이 기도 번역', yourRequest: '내 요청', editText: '✏️ 기도 내용 편집', saveChanges: '변경 사항 저장', cancel: '취소', saving: '저장 중…', prayerUpdated: '✓ 기도가 업데이트되었습니다!', markAnswered: '✅ 응답됨으로 표시', prayerAnswered: '🙌 이 기도가 응답되었습니다!' },
        discover: { title: '전 세계 요청', subtitle: '전 세계의 기도', joinPrayer: '기도에 함께하기 →', loadMore: '더 많은 기도 불러오기', loading: '불러오는 중…', endOfFeed: '모든 {n}개의 기도를 확인하셨습니다. 🙏', noPrayers: '아직 기도가 없습니다', noPrayersSub: '첫 번째로 기도 요청을 제출해 보세요.', submitRequest: '요청 제출하기 →', praying: '{n}명 기도 중', justNow: '방금', mAgo: '{n}분 전', hAgo: '{n}시간 전', dAgo: '{n}일 전' },
        dashboard: { title: '내 기도', prayerKeyTitle: '🔑 기도 열쇠', prayerKeyDesc: '이것은 기도와의 유일한 연결고리입니다 — 익명 일기의 열쇠와 같습니다. 안전한 곳에 보관하세요.', learnAnonymity: '익명성이 작동하는 방식 알아보기 →', yourRequests: '내 기도 요청', requestsFollowed: '중보한 기도 요청', noRequests: '아직 제출된 기도 요청이 없습니다.', noIntercessions: '아직 중보한 요청이 없습니다.', view: '보기', active: '활성' },
        recover: { title: '🔑 세션 복원', subtitle: '기도 열쇠를 입력하여 어느 기기에서든 이어서 사용하세요.', prayerKey: '기도 열쇠', button: '프로필 복구', backHome: '홈으로 돌아가기', howAnonymity: '익명성은 어떻게 작동하나요?' },
        faq: {
            title: '개인정보 & FAQ', subtitle: '익명성이 작동하는 방식, 저장하는 것, 그리고 이 공간을 신뢰할 수 있는 이유.',
            questions: [
                { q: '정말로 익명인가요?', a: '네. 저희는 이름, 이메일 또는 개인 정보를 절대 요청하지 않습니다. 방문 시 브라우저에 무작위 ID가 부여됩니다 — 그것이 전부입니다.' },
                { q: "'내 기도'에서 내 기도를 볼 수 있는 이유는?", a: "'내 기도'는 내 기기만 열 수 있는 개인 메모장처럼 작동합니다. 누구도 이름이나 신원으로 기도를 검색할 수 없습니다." },
                { q: '기도 열쇠는 무엇이며 왜 필요한가요?', a: '기도와의 유일한 연결고리입니다 — 익명 금고의 열쇠와 같습니다. 새 기기에서 접근하거나 브라우저를 지운 후 복원하는 데 사용합니다.' },
                { q: '어떤 개인 데이터가 저장되나요?', a: '다음만 저장됩니다: (1) 기도 요청 텍스트, (2) 무작위 익명 ID, (3) 선택적으로 대략적인 지역 — 정확한 좌표는 절대 저장되지 않습니다.' },
                { q: '위치를 공유하면 어떻게 되나요?', a: '좌표를 약간 무작위화(±1km)하고 지리적 격자 셀로 변환합니다. 실제 좌표는 저장되지 않습니다.' },
                { q: '다른 사람들이 누가 요청을 제출했는지 볼 수 있나요?', a: '아니요. 요청에는 작성자 정보가 표시되지 않습니다.' },
                { q: '제출 후 기도를 편집할 수 있나요?', a: '네. 기도 페이지에서 텍스트를 편집하거나 응답됨으로 표시할 수 있습니다 — 제출한 기기에서만 가능합니다.' },
                { q: '브라우저를 지우면 어떻게 되나요?', a: '기도는 데이터베이스에 남아 있지만 해당 기기에서 관리 기능을 잃습니다. 지우기 전에 기도 열쇠를 저장하세요.' },
                { q: '누가 이것을 운영하나요?', a: '국경을 넘어 믿음의 사람들을 기도로 연결하기 위한 개인 사역 프로젝트입니다. 광고, 데이터 판매 없습니다.' },
            ],
        },
    },
    id: {
        appName: 'Permohonan Doa Anonim',
        nav: { discover: '🌍 Temukan', myPrayers: '📿 Doa Saya', restoreSession: '🔑 Pulihkan Sesi', privacyFaq: '🔒 Privasi & FAQ', newRequest: '+ Permintaan Baru' },
        home: { subtitle: 'Bagikan permohonan doa Anda secara anonim kepada dunia.', prayerLabel: 'Permohonan Doa Anda', prayerPlaceholder: 'Tuhan, aku berdoa untuk...', locationLabel: 'Lokasi Anda (Opsional)', locationPlaceholder: 'mis. Jakarta, Indonesia atau Tokyo', locationPrivacy: 'Lokasi tepat Anda tidak pernah disimpan. Kami menggunakan Geohashing yang melindungi privasi.', submit: 'Kirim Secara Anonim', anonNote: 'Permintaan Anda sepenuhnya anonim. Identitas sementara dibuat di perangkat Anda.' },
        prayer: { prayerRequest: 'Permohonan Doa', answeredPrayer: '🙌 Doa Terjawab', prayed: '{n} mendoakan', intercessors: '🌍 {n} Pendoa Syafaat dari seluruh dunia', locationPlaceholder: 'Lokasi Anda (opsional) mis. Jakarta, Indonesia', locationPrivacyNote: '📍 Lokasi bersifat opsional dan melindungi privasi. Koordinat tepat Anda tidak pernah disimpan.', iPrayed: '🙏 Saya Sudah Berdoa', youPrayed: '✓ Anda Sudah Mendoakan Ini', shareUrl: 'Bagikan URL ini', shareCopied: '✓ Disalin ke clipboard!', shareFailed: 'Tidak dapat membagikan.', translateContent: '🌐 Terjemahkan doa ini', yourRequest: 'Permohonan Anda', editText: '✏️ Edit Teks Doa', saveChanges: 'Simpan Perubahan', cancel: 'Batal', saving: 'Menyimpan…', prayerUpdated: '✓ Doa diperbarui!', markAnswered: '✅ Tandai sebagai Terjawab', prayerAnswered: '🙌 Doa ini telah terjawab!' },
        discover: { title: 'Permintaan Global', subtitle: 'Doa-doa dari seluruh dunia', joinPrayer: 'Bergabung dalam Doa →', loadMore: 'Muat Lebih Banyak Doa', loading: 'Memuat…', endOfFeed: 'Anda telah melihat semua {n} doa. 🙏', noPrayers: 'Belum ada doa', noPrayersSub: 'Jadilah yang pertama mengirimkan permohonan doa.', submitRequest: 'Kirim permintaan →', praying: '{n} sedang berdoa', justNow: 'baru saja', mAgo: '{n}m lalu', hAgo: '{n}j lalu', dAgo: '{n}h lalu' },
        dashboard: { title: 'Doa Saya', prayerKeyTitle: '🔑 Kunci Doa Anda', prayerKeyDesc: 'Ini adalah satu-satunya koneksi Anda dengan doa-doa Anda — seperti kunci jurnal anonim. Simpan di tempat yang aman.', learnAnonymity: 'Pelajari cara anonimitas bekerja →', yourRequests: 'Permohonan Doa Anda', requestsFollowed: 'Permohonan yang Anda Ikuti', noRequests: 'Belum ada permohonan yang dikirim.', noIntercessions: 'Anda belum mendoakan permintaan apapun.', view: 'Lihat', active: 'Aktif' },
        recover: { title: '🔑 Pulihkan Sesi Anda', subtitle: 'Masukkan Kunci Doa Anda untuk melanjutkan dari mana Anda tinggalkan — di perangkat mana pun.', prayerKey: 'Kunci Doa', button: 'Pulihkan Profil Saya', backHome: 'Kembali ke Beranda', howAnonymity: 'Bagaimana anonimitas bekerja?' },
        faq: {
            title: 'Privasi & FAQ', subtitle: 'Cara kerja anonimitas, apa yang kami simpan, dan mengapa Anda dapat mempercayai ruang ini.',
            questions: [
                { q: 'Apakah ini benar-benar anonim?', a: 'Ya. Kami tidak pernah meminta nama, email, atau informasi pribadi apa pun. Browser Anda mendapatkan ID secara acak — hanya itu. Bahkan kami tidak dapat mengetahui siapa Anda.' },
                { q: "Mengapa saya bisa melihat doa saya di 'Doa Saya'?", a: "'Doa Saya' berfungsi seperti buku catatan pribadi yang hanya bisa dibuka oleh perangkat Anda. Tidak ada yang bisa mencari doa Anda berdasarkan nama, lokasi atau identitas." },
                { q: 'Apa itu Kunci Doa dan mengapa saya membutuhkannya?', a: 'Ini adalah satu-satunya koneksi Anda dengan doa-doa Anda — seperti kunci brankas anonim. Gunakan untuk mengakses doa dari perangkat baru.' },
                { q: 'Data pribadi apa yang disimpan?', a: 'Hanya: (1) teks permohonan doa, (2) ID anonim acak, dan (3) opsional, wilayah geografis umum — bukan koordinat tepat Anda.' },
                { q: 'Apa yang terjadi pada lokasi saya jika saya berbagi?', a: 'Kami mengubah koordinat secara acak(±1km) dan mengubahnya menjadi sel kisi geografis. Koordinat asli Anda tidak pernah disimpan.' },
                { q: 'Bisakah orang lain melihat siapa yang mengirim permohonan?', a: 'Tidak. Permohonan ditampilkan tanpa informasi penulis — hanya teks, wilayah secara umum, dan jumlah doa.' },
                { q: 'Bisakah saya mengedit doa setelah mengirimnya?', a: 'Ya. Di halaman doa Anda, Anda dapat mengedit teks atau menandainya sebagai terjawab — hanya dari perangkat yang mengirimnya.' },
                { q: 'Apa yang terjadi jika saya menghapus browser saya?', a: 'Doa Anda tetap ada di database, tetapi Anda kehilangan akses untuk mengelolanya di perangkat itu. Simpan Kunci Doa sebelum menghapus.' },
                { q: 'Siapa yang menjalankan ini?', a: 'Sebuah proyek pelayanan pribadi untuk menghubungkan orang percaya dalam doa lintas batas geografis. Tanpa iklan, tanpa penjualan data.' },
            ],
        },
    },
};

export function getTranslations(lang: Language) {
    return translations[lang] ?? translations.en;
}

export type T = ReturnType<typeof getTranslations>;
