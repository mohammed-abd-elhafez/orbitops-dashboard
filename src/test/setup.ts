import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

// jsdom does not implement scrolling; the app calls scrollTo after route changes.
window.scrollTo = () => {}

// Created projects and settings persist in localStorage; isolate every test.
beforeEach(() => localStorage.clear())
