// Модуль отображает сообщения комбо

import levels from '../levels';
import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getText } from '@common/langUtils';
import { FRAME, GAME_PHASE } from '../constants';
import { decimalToHex, distort, fps } from '../lib/utils';
import {
  COMBO_DISPLAY_PHASES,
  COMBO_FONT_SIZE,
  COMBO_MESSAGE_SPEED,
} from '../setup';
import {
  getCombo,
  getCurrentLevel,
  getGamePhase,
  getMuteState,
  getVolume,
} from '../selectors';

export const ComboLayer: FC = () => {
  const combo = useSelector(getCombo);
  const level = useSelector(getCurrentLevel);
  const volume = useSelector(getVolume);
  const gamePhase = useSelector(getGamePhase);
  const muteState = useSelector(getMuteState);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const comboDisplayPhase = useRef(0);
  const timeoutRef = useRef<number>();
  const requestRef = useRef<number>();
  const messageRef = useRef('');
  const comboGrow = useRef(false);

  const draw = () => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);

    if (comboDisplayPhase.current < COMBO_DISPLAY_PHASES) {
      const opacity = distort(
        208,
        COMBO_DISPLAY_PHASES,
        comboDisplayPhase.current,
        0.8
      );
      ctx.fillStyle = `#FFFF00${decimalToHex(opacity)}`;

      let scaleRatio =
        distort(1200, COMBO_DISPLAY_PHASES, comboDisplayPhase.current, 0.7) /
        1000;
      if (comboGrow.current) {
        scaleRatio += combo * 0.1;
      }
      ctx.translate(canvasRef.current.width / 2, levels[level].scorePosition.y);
      ctx.scale(scaleRatio, scaleRatio);

      let textWidth = ctx.measureText(messageRef.current).width;
      ctx.fillText(messageRef.current, -textWidth / 2, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    if (comboDisplayPhase.current <= COMBO_DISPLAY_PHASES) {
      comboDisplayPhase.current += 1;
      if (
        messageRef.current === getText('game_messages_pause') &&
        comboDisplayPhase.current === COMBO_DISPLAY_PHASES
      ) {
        // оставляем сообщение на экране
        return;
      }
      timeoutRef.current = window.setTimeout(() => {
        requestRef.current = window.requestAnimationFrame(draw);
      }, fps(COMBO_MESSAGE_SPEED));
    }
  };

  useEffect(() => {
    if (gamePhase === GAME_PHASE.PAUSED) {
      return;
    }
    if (combo >= 2) {
      comboGrow.current = true;
      messageRef.current = `x  ${combo}  ${getText('game_messages_combo')}`;
      comboDisplayPhase.current = 0;
      draw();
    }
  }, [combo]);

  useEffect(() => {
    if (gamePhase === GAME_PHASE.PAUSED) {
      return;
    }
    comboGrow.current = false;
    messageRef.current = `${getText('game_messages_volume')}  ${volume}`;
    comboDisplayPhase.current = 0;
    draw();
  }, [volume]);

  useEffect(() => {
    if (gamePhase === GAME_PHASE.PAUSED) {
      return;
    }
    comboGrow.current = false;
    messageRef.current = muteState
      ? getText('game_messages_mute')
      : getText('game_messages_sound');
    comboDisplayPhase.current = 0;
    draw();
  }, [muteState]);

  useEffect(() => {
    comboGrow.current = false;
    if (gamePhase === GAME_PHASE.STARTED) {
      messageRef.current = getText('game_messages_play');
      comboDisplayPhase.current = 0;
      draw();
    }
    if (gamePhase === GAME_PHASE.PAUSED) {
      messageRef.current = getText('game_messages_pause');
      comboDisplayPhase.current = 0;
      draw();
    }
  }, [gamePhase]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Combo canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Combo context 2d not found');
    }
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.font = `${COMBO_FONT_SIZE}px BangersLocal`;

    return () => {
      clearTimeout(timeoutRef.current);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      style={{ position: 'absolute', height: '100%', width: '100%' }}
      ref={canvasRef}
    />
  );
};
