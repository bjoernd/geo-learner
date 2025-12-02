/**
 * Runtime type validators for localStorage data
 */

import type { Statistics, Settings, ModeStatistics } from '$lib/types'

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function validateModeStatistics(value: unknown): value is ModeStatistics {
  if (!isObject(value)) return false

  return (
    isNumber(value.sessionsPlayed) &&
    value.sessionsPlayed >= 0 &&
    isNumber(value.totalQuestions) &&
    value.totalQuestions >= 0 &&
    isNumber(value.correctAnswers) &&
    value.correctAnswers >= 0 &&
    isNumber(value.successRate) &&
    value.successRate >= 0 &&
    value.successRate <= 100 &&
    isNumber(value.bestScore) &&
    value.bestScore >= 0
  )
}

export function validateStatistics(value: unknown): value is Statistics {
  if (!isObject(value)) return false

  // Check totalSessions
  if (!isNumber(value.totalSessions) || value.totalSessions < 0) {
    return false
  }

  // Check byMode structure
  if (!isObject(value.byMode)) return false
  if (!validateModeStatistics(value.byMode.laender)) return false
  if (!validateModeStatistics(value.byMode.orte)) return false

  // Check weakAreas
  if (!isArray(value.weakAreas)) return false

  for (const area of value.weakAreas) {
    if (!isObject(area)) return false
    if (!isString(area.locationId)) return false
    if (!isString(area.locationName)) return false
    if (!isNumber(area.successRate) || area.successRate < 0 || area.successRate > 100) {
      return false
    }
  }

  return true
}

export function validateSettings(value: unknown): value is Settings {
  if (!isObject(value)) return false

  return (
    isBoolean(value.timerEnabled) &&
    isNumber(value.timerDuration) &&
    value.timerDuration > 0 &&
    value.timerDuration <= 300 // Max 5 minutes seems reasonable
  )
}
