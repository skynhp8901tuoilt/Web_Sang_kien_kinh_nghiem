import React, { useState, useEffect } from 'react';
import supabase from '../config/supabase';

export default function GamesTab({ showToast, user }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState(null); // Game object being played
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // New Game Modal
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [gameType, setGameType] = useState('Chữ cái & Con số');
  const [gameAge, setGameAge] = useState('mau_giao_3_4t');
  const [gameDesc, setGameDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interactive_games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setGames(data);
      } else {
        // Fallback default games list to populate DB on first load
        const initialGames = [
          {
            title: 'Trò Chơi: Bé Chọn Hình Đúng Giúp Thỏ Con',
            game_type: 'Nhận biết & Ghép hình',
            age_group: 'mau_giao_3_4t',
            description: 'Giúp bé nhận biết các hành động vâng lời ông bà cha mẹ qua câu hỏi trắc nghiệm sinh động.',
            play_count: 128,
            game_config_json: [
              {
                question: 'Thỏ con đi chơi trong rừng và bị lạc. Ai là người đã đưa Thỏ con về nhà?',
                options: ['Bác Gấu tốt bụng', 'Bạn Bướm Vàng', 'Con Cáo già'],
                answer: 0,
                icon: 'fa-paw'
              },
              {
                question: 'Trước khi đi làm, Thỏ mẹ dặn Thỏ con điều gì?',
                options: ['Thỏ con ở nhà không đi chơi xa', 'Thỏ con đi hái hoa', 'Thỏ con đi đá bóng'],
                answer: 0,
                icon: 'fa-heart'
              }
            ]
          },
          {
            title: 'Đố Vui Nhanh Trí: Bé Đếm Số Củ Cà Rốt',
            game_type: 'Chữ cái & Con số',
            age_group: 'mau_giao_4_5t',
            description: 'Luyện tập khả năng đếm số lượng từ 1 đến 5 cho bé Mẫu giáo Nhở.',
            play_count: 95,
            game_config_json: [
              {
                question: 'Trong giỏ của Thỏ mẹ có 3 củ cà rốt, Bác Gấu cho thêm 2 củ. Hỏi trong giỏ có tất cả bao nhiêu củ cà rốt?',
                options: ['3 củ', '4 củ', '5 củ'],
                answer: 2,
                icon: 'fa-carrot'
              }
            ]
          }
        ];
        setGames(initialGames);
      }
    } catch (err) {
      console.warn('Lỗi kết nối Supabase CSDL games:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = (gameItem) => {
    setActiveGame(gameItem);
    setCurrentQuestionIdx(0);
    setGameScore(0);
    setIsFinished(false);

    // Update play_count in Supabase
    if (gameItem.id) {
      supabase
        .from('interactive_games')
        .update({ play_count: (gameItem.play_count || 0) + 1 })
        .eq('id', gameItem.id)
        .then(() => fetchGames());
    }
  };

  const handleAnswerClick = (optionIdx) => {
    const questions = activeGame.game_config_json || [];
    const currentQ = questions[currentQuestionIdx];

    if (optionIdx === currentQ.answer) {
      setGameScore(prev => prev + 10);
      showToast('Hoan hô! Bé đã chọn đáp án đúng rồi! 🎉', 'success');
    } else {
      showToast('Tiếc quá! Chưa chính xác rồi, bé thử lại nhé! 🌟', 'info');
    }

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleCreateGameSubmit = async (e) => {
    e.preventDefault();
    if (!gameTitle.trim()) return;

    setIsCreating(true);
    try {
      const payload = {
        creator_id: user?.id || null,
        creator_name: user?.fullname || 'Cô Nguyễn Thị Phương Thảo',
        title: gameTitle,
        game_type: gameType,
        age_group: gameAge,
        description: gameDesc,
        instructions: 'Chạm chọn đáp án đúng trên màn hình tương tác',
        game_config_json: [
          {
            question: `Câu hỏi đố vui tương tác cho bài: ${gameTitle}`,
            options: ['Đáp án A (Đúng)', 'Đáp án B', 'Đáp án C'],
            answer: 0
          }
        ],
        play_count: 0,
        is_active: true
      };

      const { data, error } = await supabase
        .from('interactive_games')
        .insert([payload])
        .select();

      if (error) throw error;

      showToast('Đã tạo trò chơi mới thành công và lưu vào Supabase DB!', 'success');
      setShowNewGameModal(false);
      setGameTitle('');
      setGameDesc('');
      fetchGames();
    } catch (err) {
      showToast(`Lỗi tạo game: ${err.message}`, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div class="games-page-container">
      {/* Top Banner Header */}
      <div class="card-box games-banner-card">
        <div class="banner-content-row">
          <div>
            <h2><i class="fa-solid fa-gamepad text-purple"></i> KHO TRÒ CHƠI HỌC TẬP TƯƠNG TÁC MẦM NON</h2>
            <p>Trò chơi ôn tập bài học, nhận biết chữ cái con số & ghép hình giúp phát triển tư duy số cho trẻ</p>
          </div>
          <button class="btn-accent" onClick={() => setShowNewGameModal(true)}>
            <i class="fa-solid fa-plus-circle"></i> Tạo Trò Chơi Mới
          </button>
        </div>
      </div>

      {/* Interactive Game Player Section (If active game playing) */}
      {activeGame && (
        <div class="card-box active-game-player-card margin-top">
          <div class="game-player-header">
            <h3><i class="fa-solid fa-trophy text-orange"></i> Đang Chơi: {activeGame.title}</h3>
            <button class="close-game-btn" onClick={() => setActiveGame(null)}>
              <i class="fa-solid fa-circle-xmark"></i> Thoát Trò Chơi
            </button>
          </div>

          {!isFinished ? (
            <div class="game-play-area margin-top">
              <div class="game-score-badge">
                <span>Điểm số bé đạt được: <strong>{gameScore} điểm</strong> ⭐</span>
                <span>Câu {currentQuestionIdx + 1} / {(activeGame.game_config_json || []).length}</span>
              </div>

              <div class="question-box margin-top">
                <i class="fa-solid fa-icons question-icon"></i>
                <h3>{(activeGame.game_config_json || [])[currentQuestionIdx]?.question}</h3>
              </div>

              <div class="options-grid margin-top">
                {((activeGame.game_config_json || [])[currentQuestionIdx]?.options || []).map((opt, idx) => (
                  <button key={idx} class="option-btn" onClick={() => handleAnswerClick(idx)}>
                    <span class="option-idx">{String.fromCharCode(65 + idx)}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div class="game-victory-box margin-top text-center">
              <i class="fa-solid fa-crown fa-4x text-pink"></i>
              <h2>XUẤT SẮC QUÁ! BÉ ĐÃ HOÀN THÀNH TRÒ CHƠI! 🎉</h2>
              <p class="victory-score">Tổng điểm số của bé: <strong>{gameScore} điểm</strong></p>
              <button class="btn-accent margin-top" onClick={() => handleStartGame(activeGame)}>
                <i class="fa-solid fa-rotate-right"></i> Chơi Lại Lần Nữa
              </button>
            </div>
          )}
        </div>
      )}

      {/* Games Catalog Grid */}
      <div class="games-catalog-grid margin-top">
        {loading ? (
          <div class="loading-box"><i class="fa-solid fa-spinner fa-spin"></i> Đang kết nối Supabase Database...</div>
        ) : (
          games.map((g, idx) => (
            <div key={g.id || idx} class="game-card-box">
              <div class="game-card-header">
                <span class="game-type-badge">{g.game_type}</span>
                <span class="game-age-badge">{g.age_group}</span>
              </div>
              <h3 class="game-card-title">{g.title}</h3>
              <p class="game-card-desc">{g.description || 'Trò chơi học tập mầm non tương tác số hấp dẫn.'}</p>
              <div class="game-card-footer">
                <span class="play-count-text"><i class="fa-solid fa-play"></i> {g.play_count || 0} lượt chơi</span>
                <button type="button" class="btn-primary compact-btn" onClick={() => handleStartGame(g)}>
                  <i class="fa-solid fa-gamepad"></i> Chơi Ngay
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Game Modal */}
      {showNewGameModal && (
        <div class="modal-overlay" onClick={() => setShowNewGameModal(false)}>
          <div class="modal-card" onClick={e => e.stopPropagation()}>
            <div class="modal-header">
              <h3><i class="fa-solid fa-gamepad text-purple"></i> Tạo Trò Chơi Học Tập Mới Trên Supabase</h3>
              <button class="close-btn" onClick={() => setShowNewGameModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateGameSubmit} class="modal-body">
              <div class="form-group">
                <label>Tên Trò Chơi (*):</label>
                <input 
                  type="text" 
                  class="form-control" 
                  required 
                  placeholder="Ví dụ: Trò chơi Đố vui: Nhận biết quả táo và con thỏ"
                  value={gameTitle}
                  onChange={e => setGameTitle(e.target.value)}
                />
              </div>

              <div class="form-row margin-top-sm">
                <div class="form-group flex-1">
                  <label>Loại trò chơi:</label>
                  <select class="form-control" value={gameType} onChange={e => setGameType(e.target.value)}>
                    <option value="Chữ cái & Con số">Chữ cái & Con số</option>
                    <option value="Nhận biết & Ghép hình">Nhận biết & Ghép hình</option>
                    <option value="Đố vui tương tác">Đố vui tương tác</option>
                    <option value="Âm thanh & Màu sắc">Âm thanh & Màu sắc</option>
                  </select>
                </div>

                <div class="form-group flex-1">
                  <label>Độ tuổi:</label>
                  <select class="form-control" value={gameAge} onChange={e => setGameAge(e.target.value)}>
                    <option value="mau_giao_3_4t">Mẫu giáo Bé (3-4t)</option>
                    <option value="mau_giao_4_5t">Mẫu giáo Nhở (4-5t)</option>
                    <option value="mau_giao_5_6t">Mẫu giáo Lớn (5-6t)</option>
                  </select>
                </div>
              </div>

              <div class="form-group margin-top-sm">
                <label>Mô tả ngắn trò chơi:</label>
                <textarea 
                  class="form-control" 
                  rows="2" 
                  placeholder="Mô tả hướng dẫn bé chơi..."
                  value={gameDesc}
                  onChange={e => setGameDesc(e.target.value)}
                />
              </div>

              <div class="modal-actions margin-top">
                <button type="submit" class="btn-accent" disabled={isCreating}>
                  {isCreating ? <><i class="fa-solid fa-spinner fa-spin"></i> Đang lưu DB...</> : <><i class="fa-solid fa-check"></i> Lưu & Phát Hành Trò Chơi</>}
                </button>
                <button type="button" class="btn-secondary" onClick={() => setShowNewGameModal(false)}>Hủy bỏ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
