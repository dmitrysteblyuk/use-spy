import {useEffect, useState, useRef} from 'react';
import {createSpyHook} from '../create-spy-hook';

export * from '../';
export const useSpy = createSpyHook({
  useEffect,
  useState,
  useRef
});
