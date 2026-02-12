import { Component, ElementRef, ViewChild,  Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonSkeletonText, IonSpinner
} from '@ionic/angular/standalone';
//import { ModalController } from '@ionic/angular';

import confetti from 'canvas-confetti';
import { closeOutline, trophyOutline } from 'ionicons/icons';

import { PuzzleService, MoveResponse, ClaimResponse } from 'src/app/core/services/puzzle';

type WeeklyPuzzleMeResponse = {
  weekKey: string;
  assets: {
    imageUrl: string;
    tiles: Array<{ correctIndex: number; url: string }>; // 0..8 normalmente
  };
  progress: {
    positions: number[]; // length 9, contiene 0..7 y -1 blank
    isSolved: boolean;
    rewardGranted: boolean;
  };
};


@Component({
  selector: 'app-puzzle-modal',
  standalone: true,
  templateUrl: './puzzle-modal.page.html',
  styleUrls: ['./puzzle-modal.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonSkeletonText, IonSpinner
  ],
})
export class PuzzleModalPage {
  @Output() openPuzzle = new EventEmitter<void>();
  @Output() closePuzzle = new EventEmitter<void>();

  // UI state
  loading = true;
  errorMsg = '';

  // puzzle state
  weekKey = '';
  imageUrl = '';
  tiles: string[] = [];        // tiles[tileIndex] => url
  positions: number[] = [];    // slots 0..8 => tileIndex or -1 blank

  // win/claim state
  claiming = false;
  isSolved = false;
  rewardGranted = false;
  winBanner = false;
  winEcoCoins = 0;
  winPoints = 0;

  // UX helpers
  grid = 3;
  invalidSlot = -1;

  // confetti
  @ViewChild('confettiCanvas', { static: false }) confettiCanvas?: ElementRef<HTMLCanvasElement>;

  icons = {
    close: closeOutline,
    trophy: trophyOutline,
  };

  constructor(
    private readonly puzzleApi: PuzzleService,
    //ivate readonly modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.load();
  }

  close() {
    this.closePuzzle.emit();
  }

  load() {
    this.loading = true;
    this.errorMsg = '';

    this.puzzleApi.getWeeklyMe().subscribe({
      next: (res: WeeklyPuzzleMeResponse) => {
        this.weekKey = res.weekKey;
        this.imageUrl = res.assets.imageUrl ?? '';

        // Map tiles[] by correctIndex
        const maxIndex = Math.max(...res.assets.tiles.map(t => t.correctIndex));
        this.tiles = Array(maxIndex + 1).fill('');
        for (const t of res.assets.tiles) {
          this.tiles[t.correctIndex] = t.url;
        }

        this.positions = res.progress.positions ?? [];
        this.isSolved = !!res.progress.isSolved;
        this.rewardGranted = !!res.progress.rewardGranted;

        this.loading = false;

        // si ya está resuelto y ya reclamado, muestra banner simple
        if (this.isSolved && this.rewardGranted) {
          this.winBanner = true;
        }
      },
      error: (e) => {
        console.error(e);
        this.errorMsg = 'No se pudo cargar el rompecabezas.';
        this.loading = false;
      },
    });
  }

  // ---- Sliding logic (front validation + UX)
  private blankIndex(): number {
    return this.positions.indexOf(-1);
  }

  private isNeighbor(slotA: number, slotB: number): boolean {
    const g = this.grid;
    const ar = Math.floor(slotA / g), ac = slotA % g;
    const br = Math.floor(slotB / g), bc = slotB % g;
    return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
  }

  isMovable(slotIndex: number): boolean {
    const b = this.blankIndex();
    if (b < 0) return false;
    if (this.positions[slotIndex] === -1) return false;
    return this.isNeighbor(slotIndex, b);
  }

  onSlotTap(slotIndex: number) {
    if (this.loading || this.claiming) return;

    // Solo mover si es adyacente al hueco
    if (!this.isMovable(slotIndex)) {
      this.flashInvalid(slotIndex);
      return;
    }

    const tileIndex = this.positions[slotIndex]; // 0..7
    this.puzzleApi.move(tileIndex).subscribe({
      next: (r: MoveResponse) => {
        this.positions = r.positions;
        this.isSolved = r.isSolved;
        this.rewardGranted = r.rewardGranted;

        if (r.isSolved && !r.rewardGranted) {
          // auto-claim opcional: comenta esta línea si quieres que el usuario presione botón
          // this.claim();
        }
      },
      error: (e) => {
        console.error(e);
        this.flashInvalid(slotIndex);
      },
    });
  }

  private flashInvalid(slotIndex: number) {
    this.invalidSlot = slotIndex;
    setTimeout(() => (this.invalidSlot = -1), 160);
  }

  // ---- Claim reward
  claim() {
    if (!this.isSolved) return;
    if (this.rewardGranted) return;
    if (this.claiming) return;

    this.claiming = true;

    this.puzzleApi.claim().subscribe({
      next: (res: ClaimResponse) => {
        this.claiming = false;
        this.rewardGranted = true;

        this.winEcoCoins = res.ecoCoinsGranted ?? 0;
        this.winPoints = res.puzzlePointsGranted ?? 0;

        this.winBanner = true;
        this.fireConfetti();
      },
      error: (e) => {
        console.error(e);
        this.claiming = false;
      },
    });
  }

  private fireConfetti() {
    const canvas = this.confettiCanvas?.nativeElement;
    if (!canvas) return;

    // ajusta tamaño al contenedor
    const parent = canvas.parentElement;
    const rect = parent?.getBoundingClientRect();
    if (rect) {
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
    }

    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

    myConfetti({
      particleCount: 130,
      spread: 70,
      origin: { y: 0.4 },
    });

    setTimeout(() => myConfetti({ particleCount: 80, spread: 90, origin: { y: 0.3 } }), 180);
  }

  // ---- Helpers for template
  tileUrl(tileIndex: number): string {
    return this.tiles?.[tileIndex] ?? '';
  }

  canClaim(): boolean {
    return this.isSolved && !this.rewardGranted && !this.claiming;
  }
}