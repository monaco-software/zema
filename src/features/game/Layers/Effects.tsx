/** eslint prefer-const: "error" */

import React, { FC, useEffect, useRef } from 'react';

import '../assets/styles/Layer.css';
import {
  BALL_RADIUS,
  FRAME, GAME_PHASE,
} from '../constants';
import Explosion from '../lib/explosion';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentLevel, getExplosion, getGamePhase, getParticle } from '../selectors';
import Particle from '../lib/paricle';
import { gameActions } from '../reducer';
import Skull from '../lib/skull';
import levels from '../levels';

interface Props {
  ballsPath: number[][];
}

export const EffectsLayer: FC<Props> = ({ ballsPath }) => {
  const dispatch = useDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const effects = useRef<Explosion[] | Particle[]>([]);
  const gamePhase = useSelector(getGamePhase);
  const level = useSelector(getCurrentLevel);

  const drawn = useRef(false);

  const explosion = useSelector(getExplosion);
  const particle = useSelector(getParticle);
  const skull = useRef(new Skull());

  const drawEffects = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      throw new Error('Context not found');
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    effects.current.forEach((effect, index) => {
      if (effect.phase < effect.numberOfFrames) {
        effect.update(effect.phase);
        effect.phase += 1;
        ctx.drawImage(effect.canvas, effect.x - BALL_RADIUS, effect.y - BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2);
      } else {
        effects.current.splice(index, 1);
      }
    });
    ctx.drawImage(skull.current.image, levels[level].skullPosition.x, levels[level].skullPosition.y);
    if (effects.current.length) {
      drawn.current = true;
      setTimeout(() => drawEffects(), 30);
    } else {
      drawn.current = false;
    }
    if (gamePhase === GAME_PHASE.STARTING && !effects.current.length) {
      dispatch(gameActions.setGamePhase(GAME_PHASE.STARTED));
    }
  };

  const runParticles = () => {
    for (let i = 0; i < ballsPath.length; i += BALL_RADIUS * 2) {
      setTimeout(
        () => effects.current.push(new Particle(ballsPath[i][0], ballsPath[i][1])),
        Math.floor(i / 3));
    }
    setTimeout(() => drawEffects(), 0 );
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || explosion < 0 ) {
      return;
    }
    effects.current.push(
      new Explosion(ballsPath[explosion][0], ballsPath[explosion][1])
    );
    if (!drawn.current) {
      drawEffects();
    }
  }, [explosion]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || particle < 0) {
      return;
    }
    effects.current.push(
      new Particle(ballsPath[particle][0], ballsPath[particle][1])
    );
    if (!drawn.current) {
      drawEffects();
    }
  }, [particle]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    if (gamePhase === GAME_PHASE.STARTING || gamePhase === GAME_PHASE.ENDING) {
      runParticles();
    }
  }, [gamePhase]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Effects canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
  }, []);

  return (
    <canvas className="Layer"
      ref={canvasRef} />
  );
};
