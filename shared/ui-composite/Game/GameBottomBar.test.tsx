import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameBottomBar } from '@/shared/ui-composite/Game/GameBottomBar';

describe('GameBottomBar wrong-state button display', () => {
  it('shows a check-style retry button (not next) when hideRetry is true', () => {
    const onAction = vi.fn();
    render(
      <GameBottomBar
        state='wrong'
        onAction={onAction}
        canCheck
        feedbackContent='answer-a'
        hideRetry
      />,
    );

    // Type modes (hideRetry): the wrong state should read like the check
    // state so the user retypes and re-checks, instead of looking like a
    // "next question" action.
    expect(screen.getByText('check')).toBeTruthy();
    expect(screen.queryByText('try again')).toBeNull();
    expect(screen.queryByText('next')).toBeNull();
  });

  it('shows try again when hideRetry is false', () => {
    const onAction = vi.fn();
    render(
      <GameBottomBar
        state='wrong'
        onAction={onAction}
        canCheck
        feedbackContent='answer-a'
      />,
    );

    expect(screen.getByText('try again')).toBeTruthy();
  });

  it('shows next after a correct answer', () => {
    const onAction = vi.fn();
    render(
      <GameBottomBar
        state='correct'
        onAction={onAction}
        canCheck
        feedbackContent='answer-a'
        hideRetry
      />,
    );

    expect(screen.getByText('next')).toBeTruthy();
  });
});

describe('GameBottomBar feedback freezing', () => {
  it('keeps last checked feedback while transitioning through check state', () => {
    const onAction = vi.fn();
    const { rerender } = render(
      <GameBottomBar
        state='correct'
        onAction={onAction}
        canCheck
        feedbackContent='answer-a'
      />,
    );

    expect(screen.getByText('answer-a')).toBeTruthy();

    rerender(
      <GameBottomBar
        state='check'
        onAction={onAction}
        canCheck
        feedbackContent='answer-b'
      />,
    );

    expect(screen.getByText('answer-a')).toBeTruthy();
    expect(screen.queryByText('answer-b')).toBeNull();

    rerender(
      <GameBottomBar
        state='correct'
        onAction={onAction}
        canCheck
        feedbackContent='answer-b'
      />,
    );

    expect(screen.getByText('answer-b')).toBeTruthy();
  });

  it('hides wrong feedback when clear signal changes', () => {
    const onAction = vi.fn();
    const { rerender } = render(
      <GameBottomBar
        state='wrong'
        onAction={onAction}
        canCheck
        feedbackContent='answer-a'
      />,
    );

    expect(screen.getByText('Wrong! Correct answer:')).toBeTruthy();
    expect(screen.getByText('answer-a')).toBeTruthy();

    rerender(
      <GameBottomBar
        state='wrong'
        onAction={onAction}
        canCheck
        feedbackContent='answer-a'
        clearWrongFeedbackSignal={1}
      />,
    );

    expect(screen.queryByText('Wrong! Correct answer:')).toBeNull();
    expect(screen.queryByText('answer-a')).toBeNull();

    rerender(
      <GameBottomBar
        state='wrong'
        onAction={onAction}
        canCheck
        feedbackContent='answer-a'
        clearWrongFeedbackSignal={1}
        wrongFeedbackSignal={1}
      />,
    );

    expect(screen.getByText('Wrong! Correct answer:')).toBeTruthy();
    expect(screen.getByText('answer-a')).toBeTruthy();
  });
});

