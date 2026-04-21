import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { phaserConfig } from '../game/phaserConfig';
import { GameScene } from '../game/GameScene';
import { gameApi } from '../game/api';

export function GameBoard() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [energy, setEnergy] = useState(100);
  const [hp, setHp] = useState(100);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIsReady(true);
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReady && gameContainerRef.current && !gameRef.current) {
      console.log('Initializing Phaser...');
      const config = {
        ...phaserConfig,
        parent: gameContainerRef.current,
      };
      gameRef.current = new Phaser.Game(config);
      console.log('Phaser initialized:', gameRef.current);
    }
  }, [isReady]);

  const startNewGame = async () => {
    console.log('Starting new game...');
    try {
      const session = await gameApi.startGame(20, 15, 30);
      console.log('Game session created:', session);
      setSessionId(session.sessionId);
      setShowBuildMenu(false);
      setSelectedTile(null);
      setMessage('');

      const scene = gameRef.current?.scene.getScene('GameScene') as GameScene;
      if (scene) {
        scene.initGame(session.sessionId, session.width, session.height);

        // 타일 클릭 콜백 설정
        scene.setTileClickCallback(async (x: number, y: number, state: string) => {
          if (state === 'CLEANSED') {
            // 정화된 타일 클릭 시 자동으로 건물 메뉴 오픈
            setSelectedTile({ x, y });
            setMessage(`타일 (${x}, ${y}) 선택됨`);
            setShowBuildMenu(true);
          } else if (state === 'POLLUTED') {
            // 오염된 타일은 정화
            // 이미 handleTileClick에서 처리됨
          }
        });
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const buildStructure = async (type: string) => {
    if (!sessionId || !selectedTile) {
      setMessage('타일을 선택해주세요!');
      return;
    }

    const scene = gameRef.current?.scene.getScene('GameScene') as GameScene;
    if (scene) {
      const success = await scene.buildOnSelectedTile(type);
      if (success) {
        setMessage(`${getBuildingName(type)} 건설 완료!`);
        setSelectedTile(null);
        setShowBuildMenu(false);
      } else {
        setMessage('건물 건설 실패');
      }
    }
  };

  const getBuildingName = (type: string): string => {
    switch (type) {
      case 'RESIDENTIAL': return '주거 단지';
      case 'POWER_PLANT': return '발전소';
      case 'RADAR': return '레이더';
      case 'PURIFIER_TOWER': return '정화 타워';
      default: return '건물';
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Urban Purifier</h1>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">에너지:</span>
            <span className="stat-value">{energy}</span>
          </div>
          <div className="stat">
            <span className="stat-label">HP:</span>
            <span className="stat-value">{hp}</span>
          </div>
        </div>
      </div>

      {message && (
        <div style={{
          background: 'rgba(0, 255, 136, 0.2)',
          border: '1px solid #00ff88',
          borderRadius: '8px',
          padding: '12px 20px',
          marginBottom: '15px',
          textAlign: 'center',
          color: '#00ff88',
          fontWeight: 'bold',
        }}>
          {message}
        </div>
      )}

      <div className="game-instructions">
        <h3>게임 방법</h3>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <li>오염된 타일(보라색)을 클릭해서 정화하세요</li>
          <li>정화된 타일(초록색)을 클릭하면 건물 메뉴가 나타납니다</li>
          <li>마우스를 올려 타일 상태를 확인할 수 있습니다</li>
          <li>건물을 선택하여 정화된 땅에 건설하세요</li>
        </ul>
      </div>

      <div className="game-controls">
        {!sessionId ? (
          <button
            onClick={startNewGame}
            style={{
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
              color: '#0f0f1e',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            새 게임 시작
          </button>
        ) : (
          <button
            onClick={startNewGame}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            새 게임
          </button>
        )}
      </div>

      {showBuildMenu && sessionId && selectedTile && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <h3 style={{ marginBottom: '15px', color: '#00ff88' }}>
            건물 건설 - 타일 ({selectedTile.x}, {selectedTile.y})
          </h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={() => buildStructure('RESIDENTIAL')}
              style={{
                padding: '12px 20px',
                background: 'rgba(39, 174, 96, 0.3)',
                border: '1px solid #27ae60',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              🏠 주거 단지
            </button>
            <button
              onClick={() => buildStructure('POWER_PLANT')}
              style={{
                padding: '12px 20px',
                background: 'rgba(41, 128, 185, 0.3)',
                border: '1px solid #2980b9',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              ⚡ 발전소
            </button>
            <button
              onClick={() => buildStructure('RADAR')}
              style={{
                padding: '12px 20px',
                background: 'rgba(155, 89, 182, 0.3)',
                border: '1px solid #9b59b6',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              📡 레이더
            </button>
            <button
              onClick={() => buildStructure('PURIFIER_TOWER')}
              style={{
                padding: '12px 20px',
                background: 'rgba(52, 152, 219, 0.3)',
                border: '1px solid #3498db',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              🔮 정화 타워
            </button>
            <button
              onClick={() => {
                setShowBuildMenu(false);
                setSelectedTile(null);
                const scene = gameRef.current?.scene.getScene('GameScene') as GameScene;
                if (scene) scene.clearSelection();
              }}
              style={{
                padding: '12px 20px',
                background: 'rgba(231, 76, 60, 0.3)',
                border: '1px solid #e74c3c',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              ✕ 취소
            </button>
          </div>
        </div>
      )}

      <div ref={gameContainerRef} className="phaser-container"></div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
