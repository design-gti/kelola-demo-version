// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { Trophy, Heart, TrendingUp } from 'lucide-react';

interface ClusterScoreDisplayProps {
  competencyScore: number;
  commitmentScore: number;
  contributionScore: number;
  variant?: 'compact' | 'badges' | 'bars' | 'inline';
}

export default function ClusterScoreDisplay({
  competencyScore,
  commitmentScore,
  contributionScore,
  variant = 'compact',
}: ClusterScoreDisplayProps) {
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' };
    if (score >= 60) return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
    if (score >= 40) return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
    return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
  };

  // Compact variant - 3 small circles side by side
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5">
        {/* Competency */}
        <div 
          className="flex items-center justify-center rounded-full"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: getScoreColor(competencyScore).bg,
            border: `1.5px solid ${getScoreColor(competencyScore).border}`,
          }}
          title="Competency"
        >
          <span 
            className="font-['Open_Sans'] font-bold text-[10px]"
            style={{ color: getScoreColor(competencyScore).text }}
          >
            {competencyScore}
          </span>
        </div>

        {/* Commitment */}
        <div 
          className="flex items-center justify-center rounded-full"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: getScoreColor(commitmentScore).bg,
            border: `1.5px solid ${getScoreColor(commitmentScore).border}`,
          }}
          title="Commitment"
        >
          <span 
            className="font-['Open_Sans'] font-bold text-[10px]"
            style={{ color: getScoreColor(commitmentScore).text }}
          >
            {commitmentScore}
          </span>
        </div>

        {/* Contribution */}
        <div 
          className="flex items-center justify-center rounded-full"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: getScoreColor(contributionScore).bg,
            border: `1.5px solid ${getScoreColor(contributionScore).border}`,
          }}
          title="Contribution"
        >
          <span 
            className="font-['Open_Sans'] font-bold text-[10px]"
            style={{ color: getScoreColor(contributionScore).text }}
          >
            {contributionScore}
          </span>
        </div>
      </div>
    );
  }

  // Badges variant - with icons and labels
  if (variant === 'badges') {
    return (
      <div className="flex flex-col gap-1">
        <div 
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{
            backgroundColor: getScoreColor(competencyScore).bg,
            border: `1px solid ${getScoreColor(competencyScore).border}`,
          }}
        >
          <Trophy style={{ color: '#016699' }} className="w-3 h-3" />
          <span className="font-['Open_Sans'] text-[10px] text-gray-600">Comp</span>
          <span 
            className="font-['Open_Sans'] font-bold text-[11px]"
            style={{ color: getScoreColor(competencyScore).text }}
          >
            {competencyScore}
          </span>
        </div>

        <div 
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{
            backgroundColor: getScoreColor(commitmentScore).bg,
            border: `1px solid ${getScoreColor(commitmentScore).border}`,
          }}
        >
          <Heart style={{ color: '#016699' }} className="w-3 h-3" />
          <span className="font-['Open_Sans'] text-[10px] text-gray-600">Comm</span>
          <span 
            className="font-['Open_Sans'] font-bold text-[11px]"
            style={{ color: getScoreColor(commitmentScore).text }}
          >
            {commitmentScore}
          </span>
        </div>

        <div 
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{
            backgroundColor: getScoreColor(contributionScore).bg,
            border: `1px solid ${getScoreColor(contributionScore).border}`,
          }}
        >
          <TrendingUp style={{ color: '#016699' }} className="w-3 h-3" />
          <span className="font-['Open_Sans'] text-[10px] text-gray-600">Cont</span>
          <span 
            className="font-['Open_Sans'] font-bold text-[11px]"
            style={{ color: getScoreColor(contributionScore).text }}
          >
            {contributionScore}
          </span>
        </div>
      </div>
    );
  }

  // Bars variant - horizontal bars
  if (variant === 'bars') {
    return (
      <div className="flex flex-col gap-1.5 min-w-[100px]">
        {/* Competency */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-['Open_Sans'] text-[9px] text-gray-500">Comp</span>
            <span 
              className="font-['Open_Sans'] font-bold text-[10px]"
              style={{ color: getScoreColor(competencyScore).text }}
            >
              {competencyScore}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${competencyScore}%`,
                backgroundColor: getScoreColor(competencyScore).border,
              }}
            />
          </div>
        </div>

        {/* Commitment */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-['Open_Sans'] text-[9px] text-gray-500">Comm</span>
            <span 
              className="font-['Open_Sans'] font-bold text-[10px]"
              style={{ color: getScoreColor(commitmentScore).text }}
            >
              {commitmentScore}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${commitmentScore}%`,
                backgroundColor: getScoreColor(commitmentScore).border,
              }}
            />
          </div>
        </div>

        {/* Contribution */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-['Open_Sans'] text-[9px] text-gray-500">Cont</span>
            <span 
              className="font-['Open_Sans'] font-bold text-[10px]"
              style={{ color: getScoreColor(contributionScore).text }}
            >
              {contributionScore}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${contributionScore}%`,
                backgroundColor: getScoreColor(contributionScore).border,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Inline variant - simple text with colored dots
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getScoreColor(competencyScore).border }}
          />
          <span className="font-['Open_Sans'] text-[11px] text-gray-600">
            C: <span className="font-bold" style={{ color: getScoreColor(competencyScore).text }}>{competencyScore}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getScoreColor(commitmentScore).border }}
          />
          <span className="font-['Open_Sans'] text-[11px] text-gray-600">
            C: <span className="font-bold" style={{ color: getScoreColor(commitmentScore).text }}>{commitmentScore}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getScoreColor(contributionScore).border }}
          />
          <span className="font-['Open_Sans'] text-[11px] text-gray-600">
            C: <span className="font-bold" style={{ color: getScoreColor(contributionScore).text }}>{contributionScore}</span>
          </span>
        </div>
      </div>
    );
  }

  return null;
}
